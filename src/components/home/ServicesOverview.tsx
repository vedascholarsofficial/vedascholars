import Link from 'next/link';
import { ArrowUpRight, Compass, Wallet, House, Users, GraduationCap } from 'lucide-react';
import JourneyReveal from '@/components/students/JourneyReveal';
import { SERVICE_PILLARS } from '@/lib/student-offerings';

const icons = [Compass, Wallet, House, Users, GraduationCap];

export default function ServicesOverview() {
    return (
        <section className="relative overflow-hidden bg-primary px-5 py-16 text-white md:px-8 md:py-24" aria-labelledby="home-services-heading">
            <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" aria-hidden="true" />
            <div className="relative mx-auto max-w-7xl">
                <JourneyReveal className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                    <div className="max-w-2xl">
                        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent">Five connected service pillars</p>
                        <h2 id="home-services-heading" className="text-3xl leading-tight text-white md:text-5xl">Support for every chapter of <span className="font-display font-normal italic text-accent">your journey.</span></h2>
                        <p className="mt-5 text-base leading-relaxed text-white/75">Explore practical guidance from career discovery and university choices to student life, meaningful connections and career preparation.</p>
                    </div>
                    <Link href="/services" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Explore All Services <ArrowUpRight size={16} aria-hidden="true" /></Link>
                </JourneyReveal>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {SERVICE_PILLARS.map((pillar, index) => {
                        const Icon = icons[index];
                        return <JourneyReveal key={pillar.id} delay={(index % 3) * 0.06}>
                            <Link href={`/services#${pillar.id}`} className="group flex h-full flex-col rounded-3xl border border-white/15 bg-white/5 p-7 transition-colors hover:border-accent/50 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                                <div className="mb-6 flex items-center justify-between"><Icon className="h-7 w-7 text-accent" strokeWidth={1.5} aria-hidden="true" /><span className="font-display text-2xl text-accent/70" aria-hidden="true">{pillar.number}</span></div>
                                <h3 className="mb-3 text-xl text-white">{pillar.title}</h3><p className="mb-6 text-sm leading-relaxed text-white/75">{pillar.summary}</p><span className="mt-auto flex items-center gap-2 text-sm font-semibold text-accent">Explore this pillar <ArrowUpRight size={16} aria-hidden="true" /></span>
                            </Link>
                        </JourneyReveal>;
                    })}
                    <JourneyReveal delay={0.12}>
                        <Link href="/programs" className="flex h-full flex-col justify-between rounded-3xl border border-accent/35 bg-secondary/20 p-7 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white hover:bg-secondary/30">
                            <div><p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-accent">Bring the stages together</p><h3 className="mb-3 text-xl text-white">Explore Our Programs</h3><p className="text-sm leading-relaxed text-white/75">Discover the Veda 360° Student Journey, your Student Passport and programmes for informed choices, connections, funding and career readiness.</p></div><span className="mt-6 flex items-center gap-2 text-sm font-semibold text-accent">Find your programme <ArrowUpRight size={16} aria-hidden="true" /></span>
                        </Link>
                    </JourneyReveal>
                </div>
            </div>
        </section>
    );
}
