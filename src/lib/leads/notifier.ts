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
