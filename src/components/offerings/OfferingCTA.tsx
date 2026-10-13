import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import JourneyReveal from '@/components/students/JourneyReveal';

export default function OfferingCTA({ title, description, secondaryHref, secondaryLabel }: {
    title: string; description: string; secondaryHref: string; secondaryLabel: string;
}) {
    return (
        <section className="bg-primary px-5 py-16 md:px-8 md:py-20">
            <JourneyReveal className="mx-auto max-w-3xl text-center">
                <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-accent">Your next chapter</p>
                <h2 className="text-3xl text-white md:text-4xl">{title}</h2>
                <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/75">{description}</p>
                <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                    <Link href="/contact?type=student" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-secondary px-7 py-3 font-semibold text-white transition-colors hover:bg-[#742493] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Start Your Student Journey <ArrowUpRight size={18} aria-hidden="true" /></Link>
                    <Link href={secondaryHref} className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/50 px-7 py-3 font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">{secondaryLabel}</Link>
                </div>
            </JourneyReveal>
        </section>
    );
}
