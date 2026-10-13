import { Metadata } from 'next';
import Button from '@/components/ui/Button';

// Shown (with HTTP 410) for retired routes: online accounts, job applications
// and the student portal. See RETIRED_ROUTE_PREFIXES in src/lib/site.ts.
export const metadata: Metadata = {
    title: 'Page No Longer Available',
    description: 'This page is no longer available on the Veda Scholars website.',
    robots: { index: false, follow: true },
};

export default function NoLongerAvailablePage() {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6 max-w-2xl text-center">
                <h1 className="text-3xl md:text-5xl font-heading font-bold text-primary mb-6">
                    This page is no longer available
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed mb-4">
                    Veda Scholars no longer offers online accounts, sign-in or job applications on this website.
                </p>
                <p className="text-lg text-slate-600 leading-relaxed mb-10">
                    To talk to us about your study plans, please get in touch and our team will help you directly.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="primary" size="lg" href="/contact">
                        Contact Us
                    </Button>
                    <Button variant="secondary" size="lg" href="/">
                        Go to the Home Page
                    </Button>
                </div>
                <p className="text-sm text-slate-500 mt-10">
                    If you had an account and want a copy of your information, or want it deleted, email{' '}
                    <a href="mailto:info@vedascholars.com" className="underline hover:text-primary">info@vedascholars.com</a>.
                </p>
            </div>
        </section>
    );
}
