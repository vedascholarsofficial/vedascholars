import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import JourneyReveal from '@/components/students/JourneyReveal';

export default function OfferingHero({ eyebrow, title, emphasis, description, image, imageAlt, caption, anchor, exploreLabel }: {
    eyebrow: string; title: string; emphasis: string; description: string;
    image: string; imageAlt: string; caption: string; anchor: string; exploreLabel: string;
}) {
    return (
        <section className="overflow-hidden bg-[linear-gradient(120deg,#fff_15%,#f7f1fa_100%)]">
            <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 md:px-8 md:py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
                <JourneyReveal>
                    <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">{eyebrow}</p>
                    <h1 className="text-4xl leading-[1.12] sm:text-5xl lg:text-6xl">{title} <span className="font-display font-normal italic text-secondary">{emphasis}</span></h1>
                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">{description}</p>
                    <div className="mt-8 flex flex-wrap items-center gap-5">
                        <Link href="/contact?type=student" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-secondary/15 transition-colors hover:bg-[#742493] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary">Discuss Your Options <ArrowUpRight size={18} aria-hidden="true" /></Link>
                        <Link href={anchor} className="inline-flex min-h-12 items-center gap-2 rounded-md text-sm font-semibold text-primary hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary">{exploreLabel} <ArrowDown size={16} aria-hidden="true" /></Link>
                    </div>
                </JourneyReveal>
                <JourneyReveal delay={0.1} className="relative">
                    <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] bg-muted shadow-xl shadow-primary/10">
                        <Image src={image} alt={imageAlt} fill loading="eager" sizes="(min-width: 1024px) 560px, (min-width: 640px) 720px, 100vw" className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-transparent to-transparent" />
                        <p className="absolute inset-x-0 bottom-0 p-7 font-display text-3xl italic leading-tight text-white sm:p-9 sm:text-4xl">{caption}</p>
                    </div>
                    <p className="mt-5 flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-secondary"><span className="h-px w-8 bg-secondary/40" aria-hidden="true" /> Education Beyond Admissions.</p>
                </JourneyReveal>
            </div>
        </section>
    );
}
