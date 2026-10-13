import { MetadataRoute } from 'next';
import { INDEXABLE_PAGES, absoluteUrl } from '@/lib/seo';

export const dynamic = 'force-static';

// Canonical, indexable public pages only (INDEXABLE_PAGES in src/lib/seo.ts).
// Retired routes (accounts, job applications, the portal) answer 410 Gone,
// aliases redirect and utility pages are noindex, so none are listed.
// lastModified is each page's last content change, not the build time.
export default function sitemap(): MetadataRoute.Sitemap {
    return Object.entries(INDEXABLE_PAGES).map(([path, page]) => ({
        url: absoluteUrl(path),
        lastModified: page.lastModified,
    }));
}
