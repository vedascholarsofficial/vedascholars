// Canonical origin of the public website. vedascholars.com redirects here, so
// every absolute URL (metadata, sitemap, robots, canonical tags) uses it.
export const SITE_URL = 'https://www.vedascholars.com';
export const SITE_HOST = 'www.vedascholars.com';

// Primary navigation, in display order. The Contact Us button sits after
// these links, so Contact is deliberately not repeated here.
export const PRIMARY_NAV = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Student Journey', href: '/student-journey' },
  { name: 'Services', href: '/services' },
  { name: 'Programs', href: '/programs' },
  { name: 'For Parents', href: '/for-parents' },
] as const;

export const HEADER_CTA = { name: 'Contact Us', href: '/contact' } as const;

// Routes retired from the public website: online accounts (sign-in, sign-up,
// Google sign-in, password reset), job applications and the portal behind
// them. Each prefix also covers its sub-paths. They answer 410 Gone (see
// src/proxy.ts). Source code, the API and every database record are kept.
export const RETIRED_ROUTE_PREFIXES = [
  '/login',
  '/register',
  '/auth',
  '/forgot-password',
  '/reset-password',
  '/jobs',
  '/dashboard',
  '/profile',
  '/settings',
  '/resume',
  '/applications',
  '/vedabot',
  '/admin',
  '/universities',
] as const;

export const isRetiredPath = (path: string) =>
  RETIRED_ROUTE_PREFIXES.some((route) => path === route || path.startsWith(`${route}/`));
