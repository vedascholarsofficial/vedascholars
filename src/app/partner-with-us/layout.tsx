import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Partner With Us | University & Employer Partnerships',
    description: 'Partner with Veda Scholars for university collaborations, student recruitment, and employer hiring solutions.',
};

export default function PartnerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
