import type { Metadata } from 'next';
import { NOINDEX } from '@/lib/seo';

// Confirmation page: never a search result. The page is a client component,
// so its metadata lives here.
export const metadata: Metadata = {
    title: 'Thank You',
    robots: NOINDEX,
};

export default function ThankYouLayout({ children }: { children: React.ReactNode }) {
    return children;
}
