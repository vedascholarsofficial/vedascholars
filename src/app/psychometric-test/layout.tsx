import { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';

// The page itself is a client component, so its metadata lives here.
export const metadata: Metadata = pageMetadata('/psychometric-test');

export default function PsychometricTestLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <JsonLd data={breadcrumbJsonLd('/psychometric-test')} />
            {children}
        </>
    );
}
