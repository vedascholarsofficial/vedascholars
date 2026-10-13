import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            // Retired routes (accounts, job applications, the portal) are not
            // disallowed: crawlers must be able to fetch them to see the 410
            // and drop them from search results.
            disallow: ['/api/', '/thank-you', '/no-longer-available'],
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
