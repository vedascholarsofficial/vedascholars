import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createResendNotifier } from '../src/lib/leads/notifier';
import { createLeadHandler, type LeadRecord } from '../src/lib/leads/handler';
import { leadDepsFromEnv } from '../src/lib/leads/config';

const now = new Date('2026-10-13T10:00:00Z');
const lead: LeadRecord = {
  name: 'Asha Rao', email: 'asha@example.test', phone: '+91 9876543210',
  interest: 'General Inquiry', consent: true, sourcePage: '/contact',
  consentRecord: { given: true, text: 'Consent', version: 'v1', recordedAt: now },
  ipHash: 'hash', status: 'new', notification: { status: 'pending' }, createdAt: now,
};
const settings = { apiKey: 'test-secret', from: 'Veda Scholars <hello@example.test>', to: 'admin@example.test, second@example.test' };
const post = () => new Request('https://example.test/api/leads', {
  method: 'POST', headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ ...lead, startedAt: now.getTime() - 20_000 }),
});

test('Resend sends separate plain-text admin and submitter emails with correct reply addresses', async () => {
  const calls: Request[] = [];
  const notifier = createResendNotifier(settings, async (url, init) => {
    calls.push(new Request(url, init));
    return Response.json({ id: 'email-id' });
  });
  await notifier.send(lead, 'ref-123');
  await notifier.sendConfirmation!(lead, 'ref-123');
  assert.equal(calls.length, 2);
  const admin = await calls[0].json();
  const confirmation = await calls[1].json();
  assert.equal(calls[0].url, 'https://api.resend.com/emails');
  assert.equal(calls[0].headers.get('authorization'), 'Bearer test-secret');
  assert.equal(calls[0].headers.get('idempotency-key'), 'lead-admin/ref-123');
  assert.equal(calls[1].headers.get('idempotency-key'), 'lead-confirmation/ref-123');
  assert.deepEqual(admin.to, ['admin@example.test', 'second@example.test']);
  assert.equal(admin.reply_to, lead.email);
  assert.equal(admin.from, settings.from);
  assert.ok(admin.text.includes(lead.phone));
  assert.deepEqual(confirmation.to, [lead.email]);
  assert.equal(confirmation.reply_to, 'admin@example.test');
  assert.ok(confirmation.text.includes('received your enquiry'));
  assert.ok(confirmation.text.includes('ref-123'));
  assert.equal('html' in admin, false);
  assert.equal('html' in confirmation, false);
});

test('Resend rejects provider errors and missing acceptance IDs without exposing response data', async () => {
  const failed = createResendNotifier(settings, async () => Response.json({ message: 'private email' }, { status: 403 }));
  await assert.rejects(failed.send(lead, 'ref'), { message: 'Resend email failed (HTTP 403).' });
  const empty = createResendNotifier(settings, async () => Response.json({}));
  await assert.rejects(empty.send(lead, 'ref'), /did not confirm/);
});

test('a stalled Resend request is aborted within its configured timeout', async () => {
  const notifier = createResendNotifier({ ...settings, timeoutMs: 20 }, async (_url, init) => {
    return new Promise<Response>((_resolve, reject) => {
      const keepAlive = setTimeout(() => reject(new Error('not aborted')), 1000);
      init!.signal!.addEventListener('abort', () => {
        clearTimeout(keepAlive);
        reject(init!.signal!.reason);
      }, { once: true });
    });
  });
  await assert.rejects(notifier.send(lead, 'ref'), { name: 'TimeoutError' });
});

test('confirmation failure preserves acceptance and uses a unique reference without storage', async () => {
  const refs: string[] = [];
  const logs: string[] = [];
  const handler = createLeadHandler({
    store: null, ipHashSalt: 'test-salt-0123456789', verifyCaptcha: null, now: () => now,
    log: (message) => logs.push(message),
    notifier: {
      async send(_lead, reference) { refs.push(reference); },
      async sendConfirmation(_lead, reference) { refs.push(reference); throw new Error('private'); },
    },
  });
  assert.equal((await handler(post())).status, 201);
  assert.equal((await handler(post())).status, 201);
  assert.equal(refs[0], refs[1]);
  assert.equal(refs[2], refs[3]);
  assert.notEqual(refs[0], refs[2]);
  assert.ok(logs[0].includes('confirmation email failed'));
  assert.ok(!logs.join('').includes(lead.email));
});

test('no confirmation is sent for rejected or unreceived enquiries', async () => {
  let confirmations = 0;
  const handler = createLeadHandler({
    store: null, ipHashSalt: 'test-salt-0123456789', verifyCaptcha: null, now: () => now, log: () => {},
    notifier: {
      async send() { throw new Error('admin rejected'); },
      async sendConfirmation() { confirmations++; },
    },
  });
  assert.equal((await handler(post())).status, 503);
  const invalid = new Request('https://example.test/api/leads', {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}',
  });
  assert.equal((await handler(invalid)).status, 400);
  assert.equal(confirmations, 0);
});

test('environment config prefers Resend and preserves SMTP compatibility', async () => {
  const deps = leadDepsFromEnv({
    NODE_ENV: 'test',
    RESEND_API_KEY: settings.apiKey, LEADS_MAIL_FROM: settings.from, LEADS_NOTIFY_TO: settings.to,
    LEADS_IP_HASH_SALT: 'test-salt-0123456789',
    SMTP_HOST: 'unused.example.test', SMTP_USER: 'u', SMTP_PASS: 'p',
  });
  const original = globalThis.fetch;
  // Construct again after replacing fetch: no real network or credentials are used.
  let called = false;
  globalThis.fetch = async () => { called = true; return Response.json({ id: 'email-id' }); };
  try {
    const configured = leadDepsFromEnv({ NODE_ENV: 'test', RESEND_API_KEY: settings.apiKey, LEADS_MAIL_FROM: settings.from, LEADS_NOTIFY_TO: settings.to, SMTP_HOST: 'unused.example.test', SMTP_USER: 'u', SMTP_PASS: 'p' });
    await configured.notifier!.send(lead, 'ref');
    assert.equal(called, true);
  } finally { globalThis.fetch = original; }
  assert.ok(deps.notifier?.sendConfirmation);
  const smtp = leadDepsFromEnv({ NODE_ENV: 'test', SMTP_HOST: 'example.test', SMTP_USER: 'u', SMTP_PASS: 'p', LEADS_NOTIFY_TO: settings.to });
  assert.ok(smtp.notifier);
  assert.equal(smtp.notifier.sendConfirmation, undefined);
  assert.equal(leadDepsFromEnv({ NODE_ENV: 'test', RESEND_API_KEY: 'key-only' }).notifier, null);
});
