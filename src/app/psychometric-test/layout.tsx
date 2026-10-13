import { Metadata } from 'next';

// The page itself is a client component, so its metadata lives here.
export const metadata: Metadata = {
    title: 'Career Interest Check',
    description:
        'Answer 15 quick questions to explore whether your interests lean towards technical, business leadership or creative fields. A quick interest check, not a formal assessment.',
    alternates: { canonical: '/psychometric-test' },
};

export default function PsychometricTestLayout({ children }: { children: React.ReactNode }) {
    return children;
}
