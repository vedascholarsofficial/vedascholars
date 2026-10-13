import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isRetiredPath } from '@/lib/site';

// The public website no longer offers accounts, job applications or the
// portal. Those routes answer 410 Gone with a short explanation page, so
// visitors with old links are pointed to Contact Us and search engines drop
// the URLs. The page code, the API and all stored data are kept.
export function proxy(request: NextRequest) {
  if (!isRetiredPath(request.nextUrl.pathname)) return NextResponse.next();

  return NextResponse.rewrite(new URL('/no-longer-available', request.url), {
    status: 410,
    headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' },
  });
}

// Must list the same prefixes as RETIRED_ROUTE_PREFIXES in src/lib/site.ts
// (tests/routes.test.ts checks this). Matchers have to be literal values.
export const config = {
  matcher: [
    '/login/:path*',
    '/register/:path*',
    '/auth/:path*',
    '/forgot-password/:path*',
    '/reset-password/:path*',
    '/jobs/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/resume/:path*',
    '/applications/:path*',
    '/vedabot/:path*',
    '/admin/:path*',
    '/universities/:path*',
  ],
};
