import nodemailer from 'nodemailer';
import type { LeadNotifier, LeadRecord } from './handler';

export type SmtpSettings = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  to: string;
  // Upper bound for each SMTP stage (connect, greeting, idle socket), so a
  // stalled mail server fails fast instead of outliving the request.
  timeoutMs?: number;
};

const DEFAULT_SMTP_TIMEOUT_MS = 10_000;

export type ResendSettings = {
  apiKey: string;
  from: string;
  to: string;
  timeoutMs?: number;
};

export function formatLeadConfirmation(lead: LeadRecord, reference: string) {
  return {
    subject: 'We have received your enquiry | Veda Scholars',
    text: [
      `Hi ${lead.name},`,
      '',
      'Thank you for contacting Veda Scholars. We have received your enquiry and our team will contact you shortly.',
      '',
      `Purpose: ${lead.interest}`,
      `Reference: ${reference}`,
      '',
      'You can reply to this email or call +91 7708722334 if you need help.',
      '',
      'Veda Scholars',
    ].join('\n'),
  };
}

// Use the HTTPS API directly so no additional SDK or client-side secret is needed.
export function createResendNotifier(
  settings: ResendSettings,
  request: typeof fetch = fetch,
): LeadNotifier {
  const send = async (message: Record<string, unknown>, key: string) => {
    const response = await request('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${settings.apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': key,
      },
      body: JSON.stringify({ from: settings.from, ...message }),
      signal: AbortSignal.timeout(settings.timeoutMs ?? 8_000),
    });
    // Do not include provider error bodies: they can contain personal data.
    if (!response.ok) throw new Error(`Resend email failed (HTTP ${response.status}).`);
    const result = await response.json() as { id?: string };
    if (!result.id) throw new Error('Resend did not confirm email acceptance.');
  };

  return {
    async send(lead, reference) {
      await send({
        to: settings.to.split(',').map((email) => email.trim()).filter(Boolean),
        reply_to: lead.email,
        ...formatLeadEmail(lead, reference),
      }, `lead-admin/${reference}`);
    },
    async sendConfirmation(lead, reference) {
      await send({
        to: [lead.email],
        reply_to: settings.to.split(',')[0].trim(),
        ...formatLeadConfirmation(lead, reference),
      }, `lead-confirmation/${reference}`);
    },
  };
}

// Plain text only: submitted values are never rendered as HTML.
export function formatLeadEmail(lead: LeadRecord, reference: string) {
  const lines = [
    `New website enquiry (${lead.interest})`,
    '',
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone}`,
    `Purpose: ${lead.interest}`,
    `Submitted: ${lead.createdAt.toISOString()}`,
    `Reference: ${reference}`,
    `Page: ${lead.sourcePage ?? 'unknown'}`,
  ];
  if (lead.utm) lines.push(`Campaign: ${Object.entries(lead.utm).map(([k, v]) => `${k}=${v}`).join(', ')}`);
  lines.push('', `Consent recorded (version ${lead.consentRecord.version}).`);
  lines.push('Reply to this email to respond to the enquirer directly.');

  return {
    subject: `New enquiry: ${lead.interest} from ${lead.name}`.slice(0, 150),
    text: lines.join('\n'),
  };
}

export function createSmtpNotifier(settings: SmtpSettings): LeadNotifier {
  const transport = nodemailer.createTransport({
    host: settings.host,
    port: settings.port,
    secure: settings.secure,
    auth: { user: settings.user, pass: settings.pass },
    connectionTimeout: settings.timeoutMs ?? DEFAULT_SMTP_TIMEOUT_MS,
    greetingTimeout: settings.timeoutMs ?? DEFAULT_SMTP_TIMEOUT_MS,
    socketTimeout: settings.timeoutMs ?? DEFAULT_SMTP_TIMEOUT_MS,
  });

  return {
    async send(lead, reference) {
      const { subject, text } = formatLeadEmail(lead, reference);
      await transport.sendMail({
        from: settings.from,
        to: settings.to,
        replyTo: lead.email,
        subject,
        text,
      });
    },
  };
}
