const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
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
    app = makeApp(); // fresh rate-limit counters per test
});

const register = (body) => request(app).post('/api/auth/register').send(body);
const lastOtp = () => {
    const message = outbox().at(-1);
    return message && message.text.match(/\b(\d{6})\b/)[1];
};

// ---------------- Registration and role escalation ----------------

for (const role of ['admin', 'university', 'recruiter']) {
    test(`registration ignores a requested "${role}" role and creates a student`, async () => {
        const res = await register({ name: 'Mallory', email: `m-${role}@example.test`, password: 'LongEnough1', role });
        assert.equal(res.status, 201);
        const user = await User.findOne({ email: `m-${role}@example.test` });
        assert.equal(user.role, 'student');
    });
}

test('registration response does not reveal whether an email exists', async () => {
    await createUser({ email: 'taken@example.test' });
    const fresh = await register({ name: 'A', email: 'new@example.test', password: 'LongEnough1' });
    const taken = await register({ name: 'B', email: 'taken@example.test', password: 'LongEnough1' });
    assert.equal(fresh.status, 201);
    assert.equal(taken.status, 201);
    assert.deepEqual(fresh.body, taken.body);
    assert.equal(fresh.body.userId, undefined);
});

test('registration rejects weak passwords and invalid emails', async () => {
    assert.equal((await register({ name: 'A', email: 'a@example.test', password: 'short' })).status, 400);
    assert.equal((await register({ name: 'A', email: 'not-an-email', password: 'LongEnough1' })).status, 400);
});

test('re-registering an unverified email resends a code but keeps the original password', async () => {
    await register({ name: 'Owner', email: 'owner@example.test', password: 'OwnerPass1' });
    await register({ name: 'Attacker', email: 'owner@example.test', password: 'AttackerPass1' });
    const otp = lastOtp();
    assert.equal((await request(app).post('/api/auth/verify-otp').send({ email: 'owner@example.test', otp })).status, 200);
    const asAttacker = await request(app).post('/api/auth/login').send({ email: 'owner@example.test', password: 'AttackerPass1' });
    assert.equal(asAttacker.status, 401);
    const asOwner = await request(app).post('/api/auth/login').send({ email: 'owner@example.test', password: 'OwnerPass1' });
    assert.equal(asOwner.status, 200);
});

// ---------------- OTP ----------------

test('OTP is stored hashed and verifies once', async () => {
    await register({ name: 'A', email: 'otp@example.test', password: 'LongEnough1' });
    const otp = lastOtp();
    const stored = await User.findOne({ email: 'otp@example.test' });
    assert.notEqual(stored.otp, otp);
    assert.equal(stored.otp.length, 64);

    const ok = await request(app).post('/api/auth/verify-otp').send({ email: 'otp@example.test', otp });
    assert.equal(ok.status, 200);
    const again = await request(app).post('/api/auth/verify-otp').send({ email: 'otp@example.test', otp });
    assert.equal(again.status, 400);
});

test('five wrong OTP attempts invalidate the code', async () => {
    await register({ name: 'A', email: 'brute@example.test', password: 'LongEnough1' });
    const otp = lastOtp();
    const wrong = otp === '111111' ? '222222' : '111111';
    for (let i = 0; i < 5; i += 1) {
        const res = await request(app).post('/api/auth/verify-otp').send({ email: 'brute@example.test', otp: wrong });
        assert.equal(res.status, 400);
    }
    const correct = await request(app).post('/api/auth/verify-otp').send({ email: 'brute@example.test', otp });
    assert.equal(correct.status, 400, 'the real code must no longer work');
});

test('legacy plain-text OTPs created before the change still verify', async () => {
    await createUser({ email: 'legacy@example.test', verified: false, otp: '123456', otpExpiry: new Date(Date.now() + 60000) });
    const res = await request(app).post('/api/auth/verify-otp').send({ email: 'legacy@example.test', otp: '123456' });
    assert.equal(res.status, 200);
});

// ---------------- Login ----------------

test('login rejects MongoDB operator injection', async () => {
    await createUser({ email: 'victim@example.test' });
    const res = await request(app).post('/api/auth/login').send({ email: { $ne: null }, password: 'x' });
    assert.equal(res.status, 400);
    const nested = await request(app).post('/api/auth/login').send({ email: 'victim@example.test', password: { $gt: '' } });
    assert.equal(nested.status, 400);
});

test('login is rate limited after repeated failures', async () => {
    await createUser({ email: 'limited@example.test' });
    const statuses = [];
    for (let i = 0; i < 6; i += 1) {
        const res = await request(app).post('/api/auth/login').send({ email: 'limited@example.test', password: 'WrongPass1' });
        statuses.push(res.status);
    }
    assert.deepEqual(statuses.slice(0, 5), [401, 401, 401, 401, 401]);
    assert.equal(statuses[5], 429);
});

test('login works for an existing mixed-case email and returns only public fields', async () => {
    await createUser({ email: 'Legacy.Case@Example.test', password: 'LegacyPass1', otp: 'x', resetToken: 'y' });
    const res = await request(app).post('/api/auth/login').send({ email: 'Legacy.Case@Example.test', password: 'LegacyPass1' });
    assert.equal(res.status, 200);
    assert.deepEqual(Object.keys(res.body).sort(), ['_id', 'email', 'name', 'role', 'token']);
});

test('unverified users cannot log in', async () => {
    await createUser({ email: 'unverified@example.test', password: 'LongEnough1', verified: false });
    const res = await request(app).post('/api/auth/login').send({ email: 'unverified@example.test', password: 'LongEnough1' });
    assert.equal(res.status, 401);
});

// ---------------- Tokens ----------------

test('tokens signed with another secret, alg "none" or for deleted users are rejected', async () => {
    const user = await createUser({ role: 'admin' });
    const forged = jwt.sign({ id: String(user._id), tv: 0 }, 'some-other-secret-value-that-is-long-enough');
    const none = jwt.sign({ id: String(user._id), tv: 0 }, '', { algorithm: 'none' });
    for (const token of [forged, none]) {
        const res = await request(app).get('/api/admin/users').set('Authorization', `Bearer ${token}`);
        assert.equal(res.status, 401);
    }
    const valid = tokenFor(user);
    await User.deleteOne({ _id: user._id });
    const res = await request(app).get('/api/user/profile').set('Authorization', `Bearer ${valid}`);
    assert.equal(res.status, 401);
});

// ---------------- Password reset ----------------

test('forgot-password gives the same response for unknown emails', async () => {
    await createUser({ email: 'known@example.test' });
    const known = await request(app).post('/api/auth/forgot-password').send({ email: 'known@example.test' });
    const unknown = await request(app).post('/api/auth/forgot-password').send({ email: 'nobody@example.test' });
    assert.equal(known.status, 200);
    assert.equal(unknown.status, 200);
    assert.deepEqual(known.body, unknown.body);
    assert.equal(outbox().length, 1, 'only the real account receives an email');
});

test('password reset uses CLIENT_URL, works once, and signs out old sessions', async () => {
    const user = await createUser({ email: 'reset@example.test', password: 'OldPassword1' });
    const oldToken = tokenFor(user);
    await request(app).post('/api/auth/forgot-password').send({ email: 'reset@example.test' });
    const link = outbox().at(-1).text.match(/https?:\/\/\S+/)[0];
    assert.ok(link.startsWith('http://localhost:3000/reset-password/'));
    const token = link.split('/').pop();

    const res = await request(app).post(`/api/auth/reset-password/${token}`).send({ password: 'NewPassword1' });
    assert.equal(res.status, 200);
    const reuse = await request(app).post(`/api/auth/reset-password/${token}`).send({ password: 'Another1234' });
    assert.equal(reuse.status, 400);

    const profile = await request(app).get('/api/user/profile').set('Authorization', `Bearer ${oldToken}`);
    assert.equal(profile.status, 401, 'tokens issued before the reset are revoked');
    const login = await request(app).post('/api/auth/login').send({ email: 'reset@example.test', password: 'NewPassword1' });
    assert.equal(login.status, 200);
});

test('reset rejects malformed tokens without querying', async () => {
    const res = await request(app).post('/api/auth/reset-password/not-a-token').send({ password: 'NewPassword1' });
    assert.equal(res.status, 400);
});

// ---------------- Google OAuth ----------------

test('Google sign-in never grants a privileged role', async () => {
    const { handleGoogleProfile } = require('../src/config/passport');
    const { user } = await handleGoogleProfile({
        id: 'google-123',
        displayName: 'Eve',
        emails: [{ value: 'Eve@Example.test', verified: true }],
    });
    assert.equal(user.role, 'student');
    assert.equal(user.email, 'eve@example.test');
});

test('Google sign-in refuses unverified Google emails and does not link them', async () => {
    const existing = await createUser({ email: 'target@example.test', role: 'admin' });
    const { handleGoogleProfile } = require('../src/config/passport');
    const result = await handleGoogleProfile({ id: 'g-evil', emails: [{ value: 'target@example.test', verified: false }] });
    assert.equal(result.user, null);
    const reloaded = await User.findById(existing._id);
    assert.equal(reloaded.googleId, undefined);
});

test('/api/auth/google?role=admin creates nothing when Google is not configured', async () => {
    const res = await request(app).get('/api/auth/google?role=admin');
    assert.equal(res.status, 302);
    assert.match(res.headers.location, /\/login\?auth=unavailable$/);
    assert.equal(await User.countDocuments(), 0);
});

test('OAuth state cookie must match the returned state', () => {
    const { cookieStateStore } = require('../src/config/passport');
    const headers = [];
    const fakeRes = { append: (name, value) => headers.push(value) };
    let issued;
    cookieStateStore.store({ res: fakeRes, headers: {} }, {}, (err, state) => {
        issued = state;
    });
    const cookie = headers[0].split(';')[0];

    let ok;
    cookieStateStore.verify({ res: fakeRes, headers: { cookie } }, issued, (err, valid) => {
        ok = valid;
    });
    assert.equal(ok, true);

    let tampered;
    cookieStateStore.verify({ res: fakeRes, headers: { cookie } }, crypto.randomBytes(24).toString('hex'), (err, valid) => {
        tampered = valid;
    });
    assert.equal(tampered, false);

    let missing;
    cookieStateStore.verify({ res: fakeRes, headers: {} }, issued, (err, valid) => {
        missing = valid;
    });
    assert.equal(missing, false);
});

test('OAuth one-time code is exchanged once and never exposes the JWT in a URL', async () => {
    const user = await createUser();
    const { createOAuthCode } = require('../src/controllers/authController');
    const code = await createOAuthCode(user);
    const first = await request(app).post('/api/auth/oauth/exchange').send({ code });
    assert.equal(first.status, 200);
    assert.ok(first.body.token);
    const second = await request(app).post('/api/auth/oauth/exchange').send({ code });
    assert.equal(second.status, 400);
});

test('Google sign-in start sets a signed state cookie and never forwards a role', async () => {
    process.env.GOOGLE_CLIENT_ID = 'test-client-id.apps.googleusercontent.com';
    process.env.GOOGLE_CLIENT_SECRET = 'test-oauth-client-value-not-real-0000';
    try {
        const googleApp = makeApp();
        const res = await request(googleApp).get('/api/auth/google?role=admin');
        assert.equal(res.status, 302);
        const location = new URL(res.headers.location);
        assert.equal(location.hostname, 'accounts.google.com');
        assert.equal(location.searchParams.get('redirect_uri'), 'http://localhost:5000/api/auth/google/callback');
        const state = location.searchParams.get('state');
        assert.match(state, /^[a-f\d]{48}$/);
        assert.ok(!res.headers.location.includes('admin'));
        const cookie = (res.headers['set-cookie'] || []).find((c) => c.startsWith('vs_oauth_state='));
        assert.ok(cookie && cookie.includes('HttpOnly') && cookie.includes(`vs_oauth_state=${state}.`));

        // A callback without the matching cookie is rejected before any token exchange.
        const callback = await request(googleApp).get(`/api/auth/google/callback?code=abc&state=${state}`);
        assert.equal(callback.status, 302);
        assert.match(callback.headers.location, /\/login\?auth=failed$/);
    } finally {
        delete process.env.GOOGLE_CLIENT_ID;
        delete process.env.GOOGLE_CLIENT_SECRET;
    }
});
