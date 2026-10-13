// POST /api/leads request handling, written against small interfaces so it
// can be tested without a database, mail server or network.
import { createHash } from 'node:crypto';
import { CONSENT_TEXT, CONSENT_VERSION, validateLead, type LeadInput } from './schema';

export type LeadRecord = LeadInput & {
  consentRecord: { given: true; text: string; version: string; recordedAt: Date };
  ipHash: string;
  userAgent?: string;
  referrer?: string;
  status: 'new';
  notification: { status: 'pending' | 'sent' | 'failed' | 'skipped'; attemptedAt?: Date };
  createdAt: Date;
};

export interface LeadStore {
  insert(record: LeadRecord): Promise<string>;
  countRecentByIpHash(ipHash: string, since: Date): Promise<number>;
  countRecentByEmail(email: string, since: Date): Promise<number>;
  setNotificationStatus(id: string, status: 'sent' | 'failed' | 'skipped'): Promise<void>;
}

export interface LeadNotifier {
  send(lead: LeadRecord, reference: string): Promise<void>;
}

export type LeadHandlerDeps = {
  store: LeadStore | null;
  notifier: LeadNotifier | null;
  ipHashSalt: string | null;
  // When set, a Cloudflare Turnstile token is required and verified.
  verifyCaptcha: ((token: string, ip: string) => Promise<boolean>) | null;
  now?: () => Date;
  log?: (message: string) => void;
};

export const FALLBACK_CONTACT =
  'Please call +91 7708722334 or message us on WhatsApp, and we will help you directly.';

const MAX_BODY_BYTES = 10 * 1024;
const MIN_FILL_MS = 3000; // faster than any person can fill the form
const MAX_FILL_MS = 24 * 60 * 60 * 1000;
const BURST_WINDOW_MS = 10 * 60 * 1000;
const BURST_LIMIT = 5;
const IP_WINDOW_MS = 60 * 60 * 1000;
const IP_LIMIT = 5;
const EMAIL_WINDOW_MS = 24 * 60 * 60 * 1000;
const EMAIL_LIMIT = 3;

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

const clientIp = (request: Request) => {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
};

// Same-origin check: browsers always send Origin on cross-site POSTs.
const isSameOrigin = (request: Request) => {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  try {
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
    return new URL(origin).host === host;
  } catch {
    return false;
  }
};

export function createLeadHandler(deps: LeadHandlerDeps) {
  const now = deps.now ?? (() => new Date());
  // Every message here needs operator attention, so it is logged as an error
  // (alertable in the hosting logs). Messages never contain personal data.
  const log = deps.log ?? ((message: string) => console.error(message));
  // Per-instance burst limiter; the store-backed limits below apply across
  // instances.
  const recent = new Map<string, number[]>();

  const burstLimited = (key: string, at: number) => {
    const hits = (recent.get(key) ?? []).filter((t) => at - t < BURST_WINDOW_MS);
    hits.push(at);
    recent.set(key, hits);
    if (recent.size > 5000) recent.clear();
    return hits.length > BURST_LIMIT;
  };

  return async function handleLead(request: Request): Promise<Response> {
    if (!deps.ipHashSalt || (!deps.store && !deps.notifier)) {
      log('Lead rejected: enquiry pipeline is not configured (LEADS_* / SMTP_* environment variables).');
      return json(503, { ok: false, message: `We could not submit your enquiry right now. ${FALLBACK_CONTACT}` });
    }

    if (!isSameOrigin(request)) return json(403, { ok: false, message: 'Invalid request origin.' });

    if (!(request.headers.get('content-type') || '').includes('application/json')) {
      return json(415, { ok: false, message: 'Unsupported request format.' });
    }

    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return json(413, { ok: false, message: 'Your enquiry is too long.' });

    let body: Record<string, unknown>;
    try {
      body = JSON.parse(raw);
    } catch {
      return json(400, { ok: false, message: 'Invalid request.' });
    }

    const validation = validateLead(body);
    if (!validation.ok) {
      return json(400, {
        ok: false,
        message: 'Please check the highlighted fields.',
        fieldErrors: validation.fieldErrors,
      });
    }
    const lead = validation.data;
    const at = now();

    // Spam checks: a hidden honeypot field and a minimum fill time.
    const startedAt = typeof body.startedAt === 'number' ? body.startedAt : NaN;
    const elapsed = at.getTime() - startedAt;
    const honeypotFilled = typeof body.company_website === 'string' && body.company_website.trim() !== '';
    if (honeypotFilled || !(elapsed >= MIN_FILL_MS && elapsed <= MAX_FILL_MS)) {
      return json(400, {
        ok: false,
        message: `We could not accept this submission. Please wait a moment and try again. ${FALLBACK_CONTACT}`,
      });
    }

    const ip = clientIp(request);
    if (deps.verifyCaptcha) {
      const token = typeof body.turnstileToken === 'string' ? body.turnstileToken : '';
      const passed = token !== '' && (await deps.verifyCaptcha(token, ip).catch(() => false));
      if (!passed) {
        return json(403, { ok: false, message: 'Please complete the verification check and try again.' });
      }
    }

    // IP addresses are stored only as a salted hash, for abuse limits.
    const ipHash = createHash('sha256').update(`${deps.ipHashSalt}:${ip}`).digest('hex');
    const rateLimited = () =>
      json(429, {
        ok: false,
        message: `You have sent several enquiries recently, so we have paused new submissions for a while. ${FALLBACK_CONTACT}`,
      });

    if (burstLimited(ipHash, at.getTime())) return rateLimited();

    if (deps.store) {
      try {
        const [byIp, byEmail] = await Promise.all([
          deps.store.countRecentByIpHash(ipHash, new Date(at.getTime() - IP_WINDOW_MS)),
          deps.store.countRecentByEmail(lead.email, new Date(at.getTime() - EMAIL_WINDOW_MS)),
        ]);
        if (byIp >= IP_LIMIT || byEmail >= EMAIL_LIMIT) return rateLimited();
      } catch {
        log('Lead rate-limit lookup failed; continuing with the per-instance limit only.');
      }
    }

    const record: LeadRecord = {
      ...lead,
      consentRecord: { given: true, text: CONSENT_TEXT, version: CONSENT_VERSION, recordedAt: at },
      ipHash,
      userAgent: request.headers.get('user-agent')?.slice(0, 300) || undefined,
      referrer: request.headers.get('referer')?.slice(0, 300) || undefined,
      status: 'new',
      notification: { status: deps.notifier ? 'pending' : 'skipped' },
      createdAt: at,
    };

    // 1. Store. Acceptance is confirmed once the enquiry is durably saved, or,
    //    if storage fails, once the business inbox has received it.
    let reference: string | null = null;
    try {
      if (deps.store) reference = await deps.store.insert(record);
    } catch {
      log('Lead storage failed; attempting email notification only.');
    }

    // 2. Notify the business inbox.
    let notified = false;
    if (deps.notifier) {
      try {
        await deps.notifier.send(record, reference ?? 'not-stored');
        notified = true;
      } catch {
        // The enquiry may be stored but unseen: staff must follow it up from
        // the database (notification.status = "failed").
        log(`Lead notification email failed (enquiry ${reference ?? 'not stored'}).`);
      }
      if (reference && deps.store) {
        await deps.store.setNotificationStatus(reference, notified ? 'sent' : 'failed').catch(() => {
          log('Could not record lead notification status.');
        });
      }
    }

    if (!reference && !notified) {
      return json(503, { ok: false, message: `We could not submit your enquiry right now. ${FALLBACK_CONTACT}` });
    }

    return json(201, { ok: true, reference: reference ? reference.slice(-8).toUpperCase() : null });
  };
}
