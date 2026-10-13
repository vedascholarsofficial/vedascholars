import { Metadata } from 'next';
import Button from '@/components/ui/Button';

// Unknown URLs: HTTP 404 with links back into the site. Next.js adds
// <meta name="robots" content="noindex"> to this page.
export const metadata: Metadata = {
    title: 'Page Not Found',
    description: 'The page you were looking for could not be found on the Veda Scholars website.',
};

export default function NotFound() {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6 max-w-2xl text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary mb-4">Error 404</p>
                <h1 className="text-3xl md:text-5xl font-heading font-bold text-primary mb-6">
                    We could not find that page
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed mb-10">
                    The link may be out of date or the address mistyped. Explore our services or get in touch and our team will help you directly.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="primary" size="lg" href="/">
                        Go to the Home Page
                    </Button>
                    <Button variant="secondary" size="lg" href="/contact">
                        Contact Us
                    </Button>
                </div>
            </div>
        </section>
    );
}
