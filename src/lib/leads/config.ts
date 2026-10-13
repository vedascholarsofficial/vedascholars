// Builds the lead handler's dependencies from server-side environment
// variables. Nothing here is exposed to the browser.
import type { LeadHandlerDeps } from './handler';
import { createMongoLeadStore } from './mongoStore';
import { createResendNotifier, createSmtpNotifier } from './notifier';

const verifyTurnstile = (secret: string) => async (token: string, ip: string) => {
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) return false;
  const result = (await response.json()) as { success?: boolean };
  return result.success === true;
};

export function leadDepsFromEnv(env: NodeJS.ProcessEnv = process.env): LeadHandlerDeps {
  const store =
    env.LEADS_MONGODB_URI && env.LEADS_DB_NAME
      ? createMongoLeadStore(env.LEADS_MONGODB_URI, env.LEADS_DB_NAME)
      : null;

  const smtpReady = env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS && env.LEADS_NOTIFY_TO;
  const resendReady = env.RESEND_API_KEY && env.LEADS_MAIL_FROM && env.LEADS_NOTIFY_TO;
  const notifier = resendReady
    ? createResendNotifier({
        apiKey: env.RESEND_API_KEY as string,
        from: env.LEADS_MAIL_FROM as string,
        to: env.LEADS_NOTIFY_TO as string,
      })
    : smtpReady
    ? createSmtpNotifier({
        host: env.SMTP_HOST as string,
        port: Number(env.SMTP_PORT || 465),
        secure: (env.SMTP_SECURE ?? 'true') !== 'false',
        user: env.SMTP_USER as string,
        pass: env.SMTP_PASS as string,
        from: env.LEADS_MAIL_FROM || (env.SMTP_USER as string),
        to: env.LEADS_NOTIFY_TO as string,
      })
    : null;

  if (!store) console.warn('Lead storage disabled: set LEADS_MONGODB_URI and LEADS_DB_NAME.');
  if (!notifier) console.warn('Lead emails disabled: set RESEND_API_KEY, LEADS_MAIL_FROM and LEADS_NOTIFY_TO, or configure SMTP.');

  return {
    store,
    notifier,
    // A per-deployment secret so stored IP hashes cannot be reversed by
    // hashing the IPv4 address space.
    ipHashSalt: env.LEADS_IP_HASH_SALT && env.LEADS_IP_HASH_SALT.length >= 16 ? env.LEADS_IP_HASH_SALT : null,
    verifyCaptcha: env.TURNSTILE_SECRET_KEY ? verifyTurnstile(env.TURNSTILE_SECRET_KEY) : null,
  };
}
