// Enquiry form contract shared by the contact form and the /api/leads route.

export const INTERESTS = [
  'General Inquiry',
  'Student Counselling',
  'University Partnership',
  'Employer Partnership',
] as const;

export type Interest = (typeof INTERESTS)[number];

// Stored with every enquiry so we can show exactly what the person agreed to.
// Bump the version whenever the wording changes.
export const CONSENT_VERSION = '2026-10-12';
export const CONSENT_TEXT =
  'I agree that Veda Scholars may use these details to respond to my enquiry, as described in the privacy policy.';

export type LeadInput = {
  name: string;
  email: string;
  phone: string;
  interest: Interest;
  consent: true;
  sourcePage?: string;
  utm?: Record<string, string>;
};

export type FieldErrors = Partial<Record<'name' | 'email' | 'phone' | 'interest' | 'consent', string>>;

export type ValidationResult = { ok: true; data: LeadInput } | { ok: false; fieldErrors: FieldErrors };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Digits with optional +, spaces, dashes, dots and brackets; 7–15 digits.
const PHONE_PATTERN = /^\+?[\d\s\-().]{7,25}$/;
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

// Removes control characters (including CR/LF) and trims.
const clean = (value: unknown, max: number): string | null => {
  if (typeof value !== 'string') return null;
  const cleaned = value.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim();
  return cleaned.length <= max ? cleaned : null;
};

export function validateLead(input: unknown): ValidationResult {
  const body = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>;
  const fieldErrors: FieldErrors = {};

  const name = clean(body.name, 100);
  if (!name || name.length < 2) fieldErrors.name = 'Please enter your full name.';

  const email = clean(body.email, 254)?.toLowerCase() ?? null;
  if (!email || !EMAIL_PATTERN.test(email)) fieldErrors.email = 'Please enter a valid email address.';

  const phone = clean(body.phone, 25);
  const digitCount = phone ? phone.replace(/\D/g, '').length : 0;
  if (!phone || !PHONE_PATTERN.test(phone) || digitCount < 7 || digitCount > 15) {
    fieldErrors.phone = 'Please enter a valid phone number, including the country code.';
  }

  const interest = INTERESTS.find((option) => option === body.interest);
  if (!interest) fieldErrors.interest = 'Please choose the purpose of your enquiry.';

  if (body.consent !== true) fieldErrors.consent = 'Please confirm that we may use your details to respond.';

  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors };

  const sourcePage = clean(body.sourcePage, 200) ?? undefined;
  let utm: Record<string, string> | undefined;
  if (body.utm && typeof body.utm === 'object') {
    utm = {};
    for (const key of UTM_KEYS) {
      const value = clean((body.utm as Record<string, unknown>)[key], 100);
      if (value) utm[key] = value;
    }
    if (Object.keys(utm).length === 0) utm = undefined;
  }

  return {
    ok: true,
    data: {
      name: name as string,
      email: email as string,
      phone: phone as string,
      interest: interest as Interest,
      consent: true,
      sourcePage: sourcePage && sourcePage.startsWith('/') ? sourcePage : undefined,
      utm,
    },
  };
}
