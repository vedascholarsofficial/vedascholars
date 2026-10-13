const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const request = require('supertest');
const { startDb, stopDb, clearDb, makeApp, createUser, tokenFor } = require('./helpers');

let app;
let User;
let Job;

before(async () => {
    await startDb();
    User = require('../src/models/User');
    Job = require('../src/models/Job');
});
after(stopDb);
beforeEach(async () => {
    await clearDb();
    app = makeApp();
});

const auth = (user) => ({ Authorization: `Bearer ${tokenFor(user)}` });

test('students and anonymous users cannot reach admin functionality', async () => {
    const student = await createUser();
    const job = await Job.create({ title: 'T', company: 'C', postedBy: student._id });
    const checks = [
        ['get', '/api/admin/users'],
        ['get', '/api/admin/analytics'],
        ['put', `/api/admin/users/${student._id}`],
        ['delete', `/api/admin/users/${student._id}`],
        ['get', '/api/jobs/admin/all'],
        ['put', `/api/jobs/${job._id}/approve`],
        ['delete', `/api/jobs/${job._id}`],
        ['post', '/api/universities'],
        ['get', '/api/universities/dashboard'],
        ['post', '/api/jobs/create'],
    ];
    for (const [method, url] of checks) {
        const anon = await request(app)[method](url).send({ role: 'admin' });
        assert.equal(anon.status, 401, `anonymous ${method.toUpperCase()} ${url}`);
        const asStudent = await request(app)[method](url).set(auth(student)).send({ role: 'admin' });
        assert.equal(asStudent.status, 403, `student ${method.toUpperCase()} ${url}`);
    }
    assert.equal((await User.findById(student._id)).role, 'student');
});

test('profile updates cannot change role or verification status', async () => {
    const student = await createUser({ verified: true });
    const res = await request(app)
        .put('/api/user/profile')
        .set(auth(student))
        .send({ name: 'New Name', role: 'admin', isVerified: false, tokenVersion: 99 });
    assert.equal(res.status, 200);
    const reloaded = await User.findById(student._id);
    assert.equal(reloaded.role, 'student');
    assert.equal(reloaded.isVerified, true);
    assert.equal(reloaded.tokenVersion, 0);
});

test('university dashboard returns only consenting students and no contact or résumé data', async () => {
    const university = await createUser({ role: 'university' });
    await createUser({ email: 'private@example.test', skills: ['python'] });
    await createUser({
        email: 'shared@example.test',
        shareProfileWithUniversities: true,
        resumeData: { summary: 'secret summary', skills: ['python', 'sql'] },
        phone: '+44 0000',
    });

    const res = await request(app).get('/api/universities/dashboard').set(auth(university));
    assert.equal(res.status, 200);
    assert.equal(res.body.students.length, 1);
    const [student] = res.body.students;
    assert.deepEqual(Object.keys(student).sort(), ['_id', 'name', 'skills']);
    assert.deepEqual(student.skills, ['python', 'sql']);
    const raw = JSON.stringify(res.body);
    for (const leaked of ['private@example.test', 'shared@example.test', 'secret summary', '+44 0000']) {
        assert.ok(!raw.includes(leaked), `response must not contain ${leaked}`);
    }
});

test('admin user list never includes credentials or verification secrets', async () => {
    const admin = await createUser({ role: 'admin' });
    await createUser({ otp: '654321', otpExpiry: new Date(), resetToken: 'abc', googleId: 'g1' });
    const res = await request(app).get('/api/admin/users').set(auth(admin));
    assert.equal(res.status, 200);
    for (const user of res.body) {
        for (const field of ['password', 'otp', 'otpExpiry', 'resetToken', 'resetTokenExpiry', 'googleId', 'tokenVersion', 'resumeData']) {
            assert.equal(user[field], undefined, `${field} must not be returned`);
        }
    }
});

test('admins cannot change their own role, and a role change revokes the target user tokens', async () => {
    const admin = await createUser({ role: 'admin' });
    const self = await request(app).put(`/api/admin/users/${admin._id}`).set(auth(admin)).send({ role: 'student' });
    assert.equal(self.status, 400);

    const target = await createUser({ role: 'recruiter' });
    const targetToken = tokenFor(target);
    const change = await request(app).put(`/api/admin/users/${target._id}`).set(auth(admin)).send({ role: 'student' });
    assert.equal(change.status, 200);
    assert.equal(change.body.role, 'student');
    const stale = await request(app).get('/api/jobs/recruiter').set('Authorization', `Bearer ${targetToken}`);
    assert.equal(stale.status, 401);
});

test('public job endpoints hide recruiter emails and unapproved jobs', async () => {
    const recruiter = await createUser({ role: 'recruiter', email: 'recruiter@example.test' });
    const approved = await Job.create({ title: 'Live', company: 'C', postedBy: recruiter._id, status: 'approved' });
    const pending = await Job.create({ title: 'Draft', company: 'C', postedBy: recruiter._id });

    const list = await request(app).get('/api/jobs');
    assert.equal(list.status, 200);
    assert.equal(list.body.length, 1);
    assert.ok(!JSON.stringify(list.body).includes('recruiter@example.test'));

    const one = await request(app).get(`/api/jobs/${approved._id}`);
    assert.ok(!JSON.stringify(one.body).includes('recruiter@example.test'));

    assert.equal((await request(app).get(`/api/jobs/${pending._id}`)).status, 404);
    assert.equal((await request(app).get(`/api/jobs/${pending._id}`).set(auth(recruiter))).status, 200);
});

test('recruiter edits send an approved job back to review; other recruiters are blocked', async () => {
    const owner = await createUser({ role: 'recruiter' });
    const other = await createUser({ role: 'recruiter' });
    const job = await Job.create({ title: 'Live', company: 'C', postedBy: owner._id, status: 'approved' });

    const blocked = await request(app).put(`/api/jobs/${job._id}`).set(auth(other)).send({ title: 'Hijacked' });
    assert.equal(blocked.status, 403);

    const edit = await request(app).put(`/api/jobs/${job._id}`).set(auth(owner)).send({ title: 'Changed', status: 'approved' });
    assert.equal(edit.status, 200);
    assert.equal(edit.body.status, 'pending');
});

test('applications are only possible for approved jobs and only by students', async () => {
    const recruiter = await createUser({ role: 'recruiter' });
    const student = await createUser();
    const pending = await Job.create({ title: 'Draft', company: 'C', postedBy: recruiter._id });
    const live = await Job.create({ title: 'Live', company: 'C', postedBy: recruiter._id, status: 'approved' });

    assert.equal((await request(app).post('/api/applications').set(auth(student)).send({ jobId: String(pending._id) })).status, 404);
    assert.equal((await request(app).post('/api/applications').set(auth(student)).send({ jobId: String(live._id) })).status, 201);
    assert.equal((await request(app).post(`/api/jobs/apply/${live._id}`).set(auth(recruiter))).status, 403);
});

test('malformed ids return 404 instead of a server error', async () => {
    const admin = await createUser({ role: 'admin' });
    for (const url of ['/api/jobs/not-an-id', '/api/universities/not-an-id']) {
        assert.equal((await request(app).get(url).set(auth(admin))).status, 404, url);
    }
    assert.equal((await request(app).put('/api/notifications/xyz/read').set(auth(admin))).status, 404);
});

test('security headers are set and CORS only allows configured origins', async () => {
    const res = await request(app).get('/api/health').set('Origin', 'https://evil.example');
    assert.equal(res.status, 200);
    assert.equal(res.headers['x-powered-by'], undefined);
    assert.equal(res.headers['x-content-type-options'], 'nosniff');
    assert.ok(res.headers['content-security-policy']);
    assert.equal(res.headers['access-control-allow-origin'], undefined);

    const allowed = await request(app).get('/api/health').set('Origin', 'http://localhost:3000');
    assert.equal(allowed.headers['access-control-allow-origin'], 'http://localhost:3000');
});

test('VedaBot returns a generic 503 when Gemini is not configured', async () => {
    const student = await createUser();
    const res = await request(app).post('/api/ai/chat').set(auth(student)).send({ message: 'hello' });
    assert.equal(res.status, 503);
    assert.ok(!/GEMINI|env/i.test(res.body.message));
});

test('résumé upload rejects files that are not real PDFs and keeps nothing on disk', async () => {
    const student = await createUser();
    const uploadDir = path.join(__dirname, '../uploads');
    const before = fs.readdirSync(uploadDir).length;
    const res = await request(app)
        .post('/api/user/resume/upload')
        .set(auth(student))
        .attach('resume', Buffer.from('MZ not a pdf at all'), { filename: 'cv.pdf', contentType: 'application/pdf' });
    assert.equal(res.status, 400);
    assert.equal(fs.readdirSync(uploadDir).length, before);

    const wrongType = await request(app)
        .post('/api/user/resume/upload')
        .set(auth(student))
        .attach('resume', Buffer.from('hello'), { filename: 'cv.exe', contentType: 'application/octet-stream' });
    assert.equal(wrongType.status, 400);
});

test('oversized JSON bodies are rejected', async () => {
    const res = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({ email: 'a@example.test', password: 'x'.repeat(200 * 1024) }));
    assert.equal(res.status, 413);
});
