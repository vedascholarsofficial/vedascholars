import { createLeadHandler } from '@/lib/leads/handler';
import { leadDepsFromEnv } from '@/lib/leads/config';

// Server-side enquiry pipeline: validate, filter spam, store, notify.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// Worst case: database timeouts (about 10 s) followed by the email fallback
// (SMTP timeouts of 10 s per stage). The client sees an error, never a hang.
export const maxDuration = 30;

let handler: ReturnType<typeof createLeadHandler> | undefined;

export async function POST(request: Request) {
  handler ??= createLeadHandler(leadDepsFromEnv());
  return handler(request);
}
