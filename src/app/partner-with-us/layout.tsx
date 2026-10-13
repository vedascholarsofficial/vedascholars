import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';

// The page itself is a client component, so its metadata lives here.
export const metadata: Metadata = pageMetadata('/partner-with-us');

export default function PartnerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <JsonLd data={breadcrumbJsonLd('/partner-with-us')} />
            {children}
        </>
    );
}
