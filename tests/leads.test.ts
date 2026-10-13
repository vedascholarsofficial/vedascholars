import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';
import { createLeadHandler, type LeadHandlerDeps, type LeadRecord, type LeadStore } from '../src/lib/leads/handler';
import { validateLead, CONSENT_VERSION } from '../src/lib/leads/schema';
import { createServer, type AddressInfo, type Socket } from 'node:net';
import { formatLeadEmail, createSmtpNotifier } from '../src/lib/leads/notifier';
import { createMongoLeadStore, closeLeadStoreClients } from '../src/lib/leads/mongoStore';

const NOW = new Date('2026-10-12T10:00:00Z');

const validBody = (overrides: Record<string, unknown> = {}) => ({
  name: 'Asha Rao',
  email: 'Asha.Rao@example.test',
  phone: '+91 98765 43210',
  interest: 'Student Counselling',
  consent: true,
  startedAt: NOW.getTime() - 20_000,
  company_website: '',
  sourcePage: '/contact',
  ...overrides,
});

const post = (body: unknown, headers: Record<string, string> = {}) =>
  new Request('https://www.vedascholars.com/api/leads', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      host: 'www.vedascholars.com',
      origin: 'https://www.vedascholars.com',
      'x-forwarded-for': '203.0.113.7',
      ...headers,
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });

class FakeStore implements LeadStore {
  records: (LeadRecord & { id: string })[] = [];
  statuses = new Map<string, string>();
  failInsert = false;
  async insert(record: LeadRecord) {
    if (this.failInsert) throw new Error('db down');
    const id = (this.records.length + 1).toString(16).padStart(24, '0');
    this.records.push({ ...record, id });
    return id;
  }
  async countRecentByIpHash(ipHash: string, since: Date) {
    return this.records.filter((r) => r.ipHash === ipHash && r.createdAt >= since).length;
  }
  async countRecentByEmail(email: string, since: Date) {
    return this.records.filter((r) => r.email === email && r.createdAt >= since).length;
  }
  async setNotificationStatus(id: string, status: 'sent' | 'failed' | 'skipped') {
    this.statuses.set(id, status);
  }
}

const setup = (overrides: Partial<LeadHandlerDeps> = {}) => {
  const store = new FakeStore();
  const sent: { lead: LeadRecord; reference: string }[] = [];
  let failNotify = false;
  const deps: LeadHandlerDeps = {
    store,
    notifier: {
      async send(lead, reference) {
        if (failNotify) throw new Error('smtp down');
        sent.push({ lead, reference });
      },
    },
    ipHashSalt: 'test-salt-0123456789',
    verifyCaptcha: null,
    now: () => NOW,
    log: () => {},
    ...overrides,
  };
  return {
    handler: createLeadHandler(deps),
    store,
    sent,
    failNotify: () => {
      failNotify = true;
    },
  };
};

// ---------------- Validation ----------------

test('validation normalises email and requires consent', () => {
  const ok = validateLead(validBody());
  assert.equal(ok.ok, true);
  if (ok.ok) assert.equal(ok.data.email, 'asha.rao@example.test');

  const noConsent = validateLead(validBody({ consent: 'yes' }));
  assert.equal(noConsent.ok, false);
  if (!noConsent.ok) assert.ok(noConsent.fieldErrors.consent);
});

test('validation rejects bad fields with per-field messages', () => {
  const result = validateLead({ name: 'A', email: 'nope', phone: '12', interest: 'Hack', consent: true });
  assert.equal(result.ok, false);
  if (!result.ok) assert.deepEqual(Object.keys(result.fieldErrors).sort(), ['email', 'interest', 'name', 'phone']);
});

test('validation strips control characters so values cannot inject email headers', () => {
  const result = validateLead(validBody({ name: 'Asha\r\nBcc: victim@example.test' }));
  assert.equal(result.ok, true);
  if (result.ok) assert.ok(!/[\r\n]/.test(result.data.name));
});

// ---------------- Handler: success path ----------------

test('a valid enquiry is stored with consent, notified, and confirmed with 201', async () => {
  const { handler, store, sent } = setup();
  const res = await handler(post(validBody({ utm: { utm_source: 'instagram', evil: 'x' } })));
  assert.equal(res.status, 201);
  const body = await res.json();
  assert.equal(body.ok, true);
  assert.equal(typeof body.reference, 'string');

  assert.equal(store.records.length, 1);
  const [record] = store.records;
  assert.equal(record.email, 'asha.rao@example.test');
  assert.equal(record.consentRecord.given, true);
  assert.equal(record.consentRecord.version, CONSENT_VERSION);
  assert.deepEqual(record.utm, { utm_source: 'instagram' });
  assert.notEqual(record.ipHash, '203.0.113.7');
  assert.equal(record.ipHash.length, 64);
  assert.ok(!JSON.stringify(record).includes('203.0.113.7'), 'raw IP must not be stored');

  assert.equal(sent.length, 1);
  assert.equal(store.statuses.get(record.id), 'sent');
});

test('notification email is plain text and never contains submitted HTML as markup', () => {
  const validation = validateLead(validBody({ name: '<a href="https://evil.example">Click</a>' }));
  assert.ok(validation.ok);
  const lead = {
    ...validation.data,
    consentRecord: { given: true, text: 't', version: 'v', recordedAt: NOW },
    ipHash: 'h',
    status: 'new',
    notification: { status: 'pending' },
    createdAt: NOW,
  } as LeadRecord;
  const email = formatLeadEmail(lead, 'REF');
  assert.ok(!('html' in email));
  assert.ok(email.text.includes('<a href="https://evil.example">Click</a>'), 'kept verbatim as plain text');
});

// ---------------- Handler: failures are reported, never shown as success ----------------

test('storage failure falls back to the email notification and still confirms', async () => {
  const { handler, store, sent } = setup();
  store.failInsert = true;
  const res = await handler(post(validBody()));
  assert.equal(res.status, 201);
  assert.equal(sent.length, 1);
  assert.match(sent[0].reference, /^[0-9a-f-]{36}$/, 'email-only enquiries get unique references');
});

test('when both storage and notification fail the client gets 503 with alternatives', async () => {
  const { handler, store, failNotify } = setup();
  store.failInsert = true;
  failNotify();
  const res = await handler(post(validBody()));
  assert.equal(res.status, 503);
  const body = await res.json();
  assert.equal(body.ok, false);
  assert.match(body.message, /WhatsApp/);
});

test('notification failure is recorded but the stored enquiry is still accepted', async () => {
  const { handler, store, failNotify } = setup();
  failNotify();
  const res = await handler(post(validBody()));
  assert.equal(res.status, 201);
  assert.equal(store.statuses.get(store.records[0].id), 'failed');
});

test('a failed notification is logged with the enquiry id and no personal data', async () => {
  const messages: string[] = [];
  const { handler, store, failNotify } = setup({ log: (message) => messages.push(message) });
  failNotify();
  await handler(post(validBody()));
  const logged = messages.join('\n');
  assert.ok(logged.includes(store.records[0].id), 'operators can find the enquiry');
  for (const personal of ['Asha', 'asha.rao@example.test', '98765', '203.0.113.7']) {
    assert.ok(!logged.includes(personal), `log must not contain ${personal}`);
  }
});

test('a stalled mail server fails the notification quickly instead of hanging', async () => {
  // Accepts TCP connections but never sends the SMTP greeting.
  const sockets: Socket[] = [];
  const server = createServer((socket) => sockets.push(socket));
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;
  try {
    const notifier = createSmtpNotifier({
      host: '127.0.0.1',
      port,
      secure: false,
      user: 'u',
      pass: 'p',
      from: 'from@example.test',
      to: 'to@example.test',
      timeoutMs: 300,
    });
    const validation = validateLead(validBody());
    assert.ok(validation.ok);
    const lead = {
      ...validation.data,
      consentRecord: { given: true, text: 't', version: 'v', recordedAt: NOW },
      ipHash: 'h',
      status: 'new',
      notification: { status: 'pending' },
      createdAt: NOW,
    } as LeadRecord;
    const started = Date.now();
    await assert.rejects(notifier.send(lead, 'REF'));
    assert.ok(Date.now() - started < 5000, 'gave up within the configured timeout');
  } finally {
    sockets.forEach((socket) => socket.destroy());
    await new Promise((resolve) => server.close(resolve));
  }
});

test('an unconfigured pipeline refuses submissions instead of pretending success', async () => {
  const { handler } = setup({ store: null, notifier: null });
  assert.equal((await handler(post(validBody()))).status, 503);
  const noSalt = setup({ ipHashSalt: null });
  assert.equal((await noSalt.handler(post(validBody()))).status, 503);
});

// ---------------- Handler: abuse prevention ----------------

test('missing consent returns 400 with a field error and stores nothing', async () => {
  const { handler, store } = setup();
  const res = await handler(post(validBody({ consent: false })));
  assert.equal(res.status, 400);
  assert.ok((await res.json()).fieldErrors.consent);
  assert.equal(store.records.length, 0);
});

test('honeypot and too-fast submissions are rejected', async () => {
  const { handler, store } = setup();
  assert.equal((await handler(post(validBody({ company_website: 'http://spam.example' })))).status, 400);
  assert.equal((await handler(post(validBody({ startedAt: NOW.getTime() - 500 })))).status, 400);
  assert.equal((await handler(post(validBody({ startedAt: undefined })))).status, 400);
  assert.equal(store.records.length, 0);
});

test('cross-origin posts, wrong content types, bad JSON and oversized bodies are rejected', async () => {
  const { handler, store } = setup();
  assert.equal((await handler(post(validBody(), { origin: 'https://evil.example' }))).status, 403);
  assert.equal((await handler(post(validBody(), { 'content-type': 'text/plain' }))).status, 415);
  assert.equal((await handler(post('{not json'))).status, 400);
  assert.equal((await handler(post(validBody({ name: 'x'.repeat(20_000) })))).status, 413);
  assert.equal(store.records.length, 0);
});

test('repeated submissions from one IP are rate limited', async () => {
  const { handler } = setup();
  const statuses: number[] = [];
  for (let i = 0; i < 7; i += 1) {
    const res = await handler(post(validBody({ email: `person${i}@example.test` })));
    statuses.push(res.status);
  }
  assert.deepEqual(statuses.slice(0, 5), [201, 201, 201, 201, 201]);
  assert.equal(statuses[5], 429);
});

test('repeated submissions for one email are rate limited across IPs', async () => {
  const { handler } = setup();
  const statuses: number[] = [];
  for (let i = 0; i < 4; i += 1) {
    const res = await handler(post(validBody(), { 'x-forwarded-for': `198.51.100.${i}` }));
    statuses.push(res.status);
  }
  assert.deepEqual(statuses, [201, 201, 201, 429]);
});

test('when Turnstile is configured, a missing or failed token is rejected', async () => {
  let calls = 0;
  const { handler, store } = setup({
    verifyCaptcha: async (token) => {
      calls += 1;
      return token === 'good-token';
    },
  });
  assert.equal((await handler(post(validBody()))).status, 403);
  assert.equal((await handler(post(validBody({ turnstileToken: 'bad' })))).status, 403);
  assert.equal((await handler(post(validBody({ turnstileToken: 'good-token' })))).status, 201);
  assert.equal(calls, 2, 'missing token never reaches the verifier');
  assert.equal(store.records.length, 1);
});

// ---------------- Real MongoDB store ----------------

let mongod: MongoMemoryServer;
before(async () => {
  mongod = await MongoMemoryServer.create();
});
after(async () => {
  await closeLeadStoreClients();
  await mongod.stop();
});

test('MongoDB store persists enquiries, creates indexes and counts recent submissions', async () => {
  const store = createMongoLeadStore(mongod.getUri(), 'veda_test');
  const { handler } = setup({ store });
  const res = await handler(post(validBody()));
  assert.equal(res.status, 201);

  const client = await MongoClient.connect(mongod.getUri());
  try {
    const collection = client.db('veda_test').collection('enquiries');
    const docs = await collection.find().toArray();
    assert.equal(docs.length, 1);
    assert.equal(docs[0].email, 'asha.rao@example.test');
    assert.equal(docs[0].consentRecord.given, true);
    assert.equal(docs[0].notification.status, 'sent');
    const indexNames = (await collection.indexes()).map((i) => i.name);
    assert.ok(indexNames.includes('ipHash_1_createdAt_-1'));
    assert.equal(await store.countRecentByEmail('asha.rao@example.test', new Date(NOW.getTime() - 1000)), 1);
  } finally {
    await client.close();
  }
});
