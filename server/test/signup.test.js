// Public sign-up is closed by default: the website no longer offers accounts,
// so the API must not create any, whatever the request asks for.
const { test, before, after, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { startDb, stopDb, clearDb, makeApp, createUser, tokenFor, outbox } = require('./helpers');

let app;
let User;

before(async () => {
    await startDb();
    User = require('../src/models/User');
});
after(stopDb);
beforeEach(async () => {
    await clearDb();
    outbox().length = 0;
    delete process.env.PUBLIC_SIGNUP_ENABLED; // production default
    app = makeApp();
});
afterEach(() => {
    process.env.PUBLIC_SIGNUP_ENABLED = 'true';
    require('../src/config/env').resetConfig();
});

test('sign-up is closed unless PUBLIC_SIGNUP_ENABLED is exactly "true"', () => {
    const { loadConfig } = require('../src/config/env');
    const base = { JWT_SECRET: process.env.JWT_SECRET, MONGO_URI: 'mongodb://localhost/x' };
    assert.equal(loadConfig(base).publicSignupEnabled, false);
    assert.equal(loadConfig({ ...base, PUBLIC_SIGNUP_ENABLED: '1' }).publicSignupEnabled, false);
    assert.equal(loadConfig({ ...base, PUBLIC_SIGNUP_ENABLED: 'yes' }).publicSignupEnabled, false);
    assert.equal(loadConfig({ ...base, PUBLIC_SIGNUP_ENABLED: 'true' }).publicSignupEnabled, true);
});

for (const role of [undefined, 'student', 'admin', 'university', 'recruiter']) {
    test(`registration${role ? ` as "${role}"` : ''} is refused and creates nothing`, async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Mallory', email: 'mallory@example.test', password: 'LongEnough1', role });
        assert.equal(res.status, 403);
        assert.equal(await User.countDocuments(), 0);
        assert.equal(outbox().length, 0, 'no verification email is sent');
    });
}

test('closed registration does not resend codes to existing unverified accounts', async () => {
    await createUser({ email: 'pending@example.test', verified: false });
    const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Pending', email: 'pending@example.test', password: 'LongEnough1' });
    assert.equal(res.status, 403);
    assert.equal(outbox().length, 0);
});

test('Google sign-in creates no account while sign-up is closed', async () => {
    const { handleGoogleProfile } = require('../src/config/passport');
    const result = await handleGoogleProfile({
        id: 'google-new',
        displayName: 'New Person',
        emails: [{ value: 'new@example.test', verified: true }],
    });
    assert.equal(result.user, null);
    assert.equal(await User.countDocuments(), 0);
});

test('Google sign-in still works for an existing account and keeps its role', async () => {
    const existing = await createUser({ email: 'staff@example.test', role: 'admin' });
    const { handleGoogleProfile } = require('../src/config/passport');
    const { user } = await handleGoogleProfile({
        id: 'google-staff',
        emails: [{ value: 'staff@example.test', verified: true }],
    });
    assert.equal(String(user._id), String(existing._id));
    assert.equal(user.role, 'admin');
    assert.equal(await User.countDocuments(), 1);
});

test('existing accounts can still sign in while sign-up is closed', async () => {
    await createUser({ email: 'student@example.test', password: 'CorrectHorse1' });
    const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'student@example.test', password: 'CorrectHorse1' });
    assert.equal(res.status, 200);
    assert.equal(res.body.role, 'student');
    assert.ok(res.body.token);
});

test('a student cannot promote themselves, and only admins can change roles', async () => {
    const student = await createUser({ role: 'student' });
    const target = await createUser({ role: 'student' });
    const studentToken = tokenFor(student);

    const self = await request(app)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ role: 'admin' });
    assert.notEqual(self.status, 500);
    assert.equal((await User.findById(student._id)).role, 'student');

    const promote = await request(app)
        .put(`/api/admin/users/${target._id}`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ role: 'admin' });
    assert.ok([401, 403, 404].includes(promote.status), `unexpected status ${promote.status}`);
    assert.equal((await User.findById(target._id)).role, 'student');
});

test('anonymous and student requests cannot read student data', async () => {
    const student = await createUser({ role: 'student' });
    const anonymous = await Promise.all([
        request(app).get('/api/admin/users'),
        request(app).get('/api/universities/dashboard'),
        request(app).get('/api/user/profile'),
    ]);
    for (const res of anonymous) assert.equal(res.status, 401);

    const asStudent = await Promise.all([
        request(app).get('/api/admin/users').set('Authorization', `Bearer ${tokenFor(student)}`),
        request(app).get('/api/universities/dashboard').set('Authorization', `Bearer ${tokenFor(student)}`),
    ]);
    for (const res of asStudent) assert.ok([403, 404].includes(res.status), `unexpected status ${res.status}`);
});
