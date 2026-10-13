import { createLeadHandler } from '@/lib/leads/handler';
import { leadDepsFromEnv } from '@/lib/leads/config';

// Server-side enquiry pipeline: validate, filter spam, store, notify.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// Allow database operations plus two bounded Resend sends (8 s each), or
// the legacy SMTP fallback. Provider calls cannot wait indefinitely.
export const maxDuration = 60;

let handler: ReturnType<typeof createLeadHandler> | undefined;

export async function POST(request: Request) {
  handler ??= createLeadHandler(leadDepsFromEnv());
  return handler(request);
}
