import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

// Vercel preview deployments are built with VERCEL_ENV=preview: keep them out
// of search engines entirely. Production (and local builds) allow crawling.
// Production is also reachable on vedascholars.vercel.app; next.config.ts
// sends X-Robots-Tag: noindex for every host except the canonical one.
export default function robots(): MetadataRoute.Robots {
    const vercelEnv = process.env.VERCEL_ENV;
    if (vercelEnv && vercelEnv !== 'production') {
        return { rules: { userAgent: '*', disallow: '/' } };
    }
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            // Retired routes (accounts, job applications, the portal) are not
            // disallowed: crawlers must be able to fetch them to see the 410
            // and drop them from search results. Likewise noindex pages
            // (/thank-you, /no-longer-available) stay crawlable so their
            // noindex is seen.
            disallow: ['/api/'],
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
