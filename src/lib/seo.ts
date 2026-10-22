import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const SITE_NAME = 'Veda Scholars';
export const SITE_TAGLINE = 'Education to Employment Support';
export const DEFAULT_DESCRIPTION =
  'Veda Scholars helps students, universities, and employers bridge the gap between education and employment through global counselling, partnerships, and recruitment support.';

type PageSeo = {
  /** Page title without the brand; " | Veda Scholars" is appended. */
  title: string;
  description: string;
  /** Short name for breadcrumbs. */
  name: string;
  /** Date the page's visible content last changed (YYYY-MM-DD). Update it
   *  with content edits; the sitemap reports it to search engines. */
  lastModified: string;
};

// Every indexable public page, in sitemap order. Adding a page here lists it
// in the sitemap, so only add canonical, public, indexable pages. Aliases,
// retired routes (RETIRED_ROUTE_PREFIXES) and utility pages stay out.
export const INDEXABLE_PAGES = {
  '/': {
    name: 'Home',
    title: SITE_TAGLINE,
    description: DEFAULT_DESCRIPTION,
    lastModified: '2026-10-13',
  },
  '/about': {
    name: 'About Us',
    title: 'About Us',
    description:
      'Veda Scholars provides education-to-employment support, guiding students and families and working with universities and employers. Read our vision, values and story.',
    lastModified: '2026-10-13',
  },
  '/student-journey': {
    name: 'Student Journey',
    title: 'Our Student Journey',
    description:
      'Discover, Choose, Apply, Settle, Connect, Advance: how Veda Scholars supports students before, during and after enrolment.',
    lastModified: '2026-10-13',
  },
  '/services': {
    name: 'Services',
    title: 'Services: Five Pillars of Student Support',
    description:
      'Explore Discover & Decide, Access & Affordability, Prepare & Settle, Learn, Connect & Grow, and Career & Beyond with Veda Scholars.',
    lastModified: '2026-10-13',
  },
  '/programs': {
    name: 'Programs',
    title: 'Programs: A Connected Student Ecosystem',
    description:
      'Six connected programmes, from the Veda 360° Student Journey and Student Passport to Student Connect, career networking and scholarship guidance.',
    lastModified: '2026-10-13',
  },
  '/for-parents': {
    name: 'For Parents',
    title: 'For Parents and Families',
    description:
      'Clear information for parents and families on course suitability, costs, scholarships, accommodation and student wellbeing.',
    lastModified: '2026-10-13',
  },
  '/students': {
    name: 'Study Abroad',
    title: 'Study Abroad & Career Guidance for Students',
    description:
      'Study abroad counselling with Veda Scholars: university selection, scholarship and application guidance, visa guidance and career planning.',
    lastModified: '2026-10-13',
  },
  '/psychometric-test': {
    name: 'Career Interest Check',
    title: 'Career Interest Check',
    description:
      'Answer 15 quick questions to explore whether your interests lean towards technical, business leadership or creative fields. A quick interest check, not a formal assessment.',
    lastModified: '2026-10-13',
  },
  '/partner-with-us': {
    name: 'Partner With Us',
    title: 'Partner With Us: Universities and Employers',
    description:
      'Partner with Veda Scholars for university collaborations, student recruitment, and employer hiring solutions.',
    lastModified: '2026-10-13',
  },
  '/contact': {
    name: 'Contact Us',
    title: 'Contact Us: Book a Free Consultation',
    description:
      'Contact Veda Scholars to book a free first counselling session, explore partnerships, or discuss recruitment opportunities.',
    lastModified: '2026-10-13',
  },
  '/careers': {
    name: 'Careers',
    title: 'Careers: Join Our Team',
    description:
      'Work with Veda Scholars and help deliver education-to-employment support. See our current openings and how to send us your application.',
    lastModified: '2026-10-13',
  },
  '/privacy-policy': {
    name: 'Privacy Policy',
    title: 'Privacy Policy',
    description: 'Learn how Veda Scholars collects, uses, and protects your personal information.',
    lastModified: '2026-10-13',
  },
  '/terms-of-service': {
    name: 'Terms of Service',
    title: 'Terms of Service',
    description: 'Terms and conditions governing the use of the Veda Scholars website and services.',
    lastModified: '2026-10-13',
  },
  '/cookie-policy': {
    name: 'Cookie Policy',
    title: 'Cookie Policy',
    description: 'Understand how the Veda Scholars website uses cookies and how you can manage them.',
    lastModified: '2026-10-13',
  },
} as const satisfies Record<string, PageSeo>;

export type IndexablePath = keyof typeof INDEXABLE_PAGES;

export const absoluteUrl = (path: string) => (path === '/' ? SITE_URL : `${SITE_URL}${path}`);

export const fullTitle = (path: IndexablePath) =>
  path === '/' ? `${SITE_NAME} | ${SITE_TAGLINE}` : `${INDEXABLE_PAGES[path].title} | ${SITE_NAME}`;

// The shared preview image generated by src/app/opengraph-image.tsx. Named
// explicitly because a page that sets its own openGraph/twitter object does
// not inherit the root segment's file-based image. Bump the ?v= query when the
// image changes so WhatsApp, LinkedIn and Facebook fetch it again instead of
// showing their cached copy of the old one.
export const SOCIAL_IMAGE = {
  url: '/opengraph-image?v=2',
  width: 1200,
  height: 630,
  type: 'image/png',
  alt: 'Veda Scholars: education to employment support',
};

// Metadata for an indexable page: title, description, canonical, Open Graph
// and X tags all describe the same page. Each page sets openGraph and twitter
// in full because nested metadata objects replace (not merge with) the root
// layout's.
export function pageMetadata(path: IndexablePath): Metadata {
  const { description } = INDEXABLE_PAGES[path];
  const title = fullTitle(path);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: 'en_US',
      url: path,
      title,
      description,
      images: [SOCIAL_IMAGE],
    },
    twitter: { card: 'summary_large_image', title, description, images: [SOCIAL_IMAGE] },
  };
}

// Pages that must never appear in search results (confirmation and utility
// pages). Search engines may still follow their links.
export const NOINDEX: Metadata['robots'] = { index: false, follow: true };

// ---------------- Structured data (schema.org JSON-LD) ----------------
// Only facts the website itself publishes: name, address of the site, logo,
// the footer's email, phone and social profiles. No ratings, reviews,
// office addresses, accreditations or partnerships.

export const SOCIAL_PROFILES = [
  'https://www.linkedin.com/company/veda-scholars/',
  'https://www.youtube.com/@VedaScholars-q5',
  'https://www.facebook.com/VedaScholars/',
  'https://www.instagram.com/veda_scholars/',
] as const;

export const CONTACT_EMAIL = 'info@vedascholars.com';
export const CONTACT_PHONE = '+91 7708722334';

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export const organizationJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/images/veda-logo.png`,
  description: DEFAULT_DESCRIPTION,
  email: CONTACT_EMAIL,
  telephone: CONTACT_PHONE,
  sameAs: [...SOCIAL_PROFILES],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE,
    url: absoluteUrl('/contact'),
  },
});

export const websiteJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: 'en',
  publisher: { '@id': ORGANIZATION_ID },
});

export const breadcrumbJsonLd = (path: Exclude<IndexablePath, '/'>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: INDEXABLE_PAGES['/'].name, item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: INDEXABLE_PAGES[path].name, item: absoluteUrl(path) },
  ],
});
