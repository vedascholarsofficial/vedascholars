import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

// Public pages only. Retired routes (accounts, job applications, the portal)
// answer 410 Gone and are never listed; see RETIRED_ROUTE_PREFIXES.
const pages: { path: string; changeFrequency: 'monthly' | 'yearly'; priority: number }[] = [
    { path: '', changeFrequency: 'monthly', priority: 1 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/student-journey', changeFrequency: 'monthly', priority: 0.9 },
    { path: '/services', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/programs', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/for-parents', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/students', changeFrequency: 'monthly', priority: 0.9 },
    { path: '/psychometric-test', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/partner-with-us', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/careers', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/privacy-policy', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/terms-of-service', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/cookie-policy', changeFrequency: 'yearly', priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
    return pages.map(({ path, changeFrequency, priority }) => ({
        url: `${SITE_URL}${path}`,
        lastModified: new Date(),
        changeFrequency,
        priority,
    }));
}
