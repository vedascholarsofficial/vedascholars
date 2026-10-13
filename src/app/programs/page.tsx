import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Check, Compass, GraduationCap, Map, NotebookPen, Users, Wallet } from 'lucide-react';
import OfferingHero from '@/components/offerings/OfferingHero';
import OfferingCTA from '@/components/offerings/OfferingCTA';
import JourneyReveal from '@/components/students/JourneyReveal';
import { PROGRAMS } from '@/lib/student-offerings';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata('/programs');

const programIds = ['veda-360', 'student-passport', 'before-you-decide', 'student-connect', 'career-internship-network', 'scholarship-financial-access'];
const icons = [Compass, NotebookPen, Map, Users, GraduationCap, Wallet];
const experiences = [
    { image: '/images/programs/before-you-decide.webp', alt: 'A student guide showing university visitors around a lecture theatre', label: 'Explore before committing', note: 'Conversations, Q&As and tours depend on participating students, academics and universities.', link: '/services#discover-decide', linkLabel: 'Discover & Decide' },
    { image: '/images/programs/student-connect.webp', alt: 'Young students sharing a friendly peer conversation in a university courtyard', label: 'Learn from lived experience', note: 'Participation is based on verified ambassadors, agreed expectations and consent. Personal details are shared only with permission.', link: '/services#learn-connect-grow', linkLabel: 'Learn, Connect & Grow' },
    { image: '/images/programs/career-internship-network.webp', alt: 'A student working with a mentor on a design project in a professional studio', label: 'A developing network', note: 'Talks, projects and opportunities depend on participating employers, alumni and partners. Internships and jobs are never guaranteed.', link: '/services#career-beyond', linkLabel: 'Career & Beyond' },
    { image: '/images/programs/scholarship-financial-access.webp', alt: 'A student reviewing a scholarship application and writing notes in her planner', label: 'Make funding part of your plan', note: 'Opportunities have individual deadlines and eligibility conditions. Funding decisions rest with scholarship providers.', link: '/services#access-affordability', linkLabel: 'Access & Affordability' },
];

export default function ProgramsPage() {
    return (
        <div className="min-h-screen bg-white">
            <JsonLd data={breadcrumbJsonLd('/programs')} />
            <OfferingHero eyebrow="Our Programs" title="Your potential." emphasis="A world of possibilities." description="Six connected programmes bring your roadmap, decisions, student connections and career preparation into one student-centred ecosystem." image="/images/programs/hero.webp" imageAlt="A young student looking ahead with confidence on a university terrace" caption="Every chapter brings a new possibility." anchor="#our-programs" exploreLabel="Explore our Programs" />

            <section id="our-programs" aria-labelledby="programs-heading" className="scroll-mt-24 px-5 py-14 md:px-8">
                <div className="mx-auto max-w-7xl">
                    <JourneyReveal><p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">One ecosystem, six programmes</p><h2 id="programs-heading" className="text-3xl md:text-4xl">A clearer path through what comes next.</h2><p className="mt-4 max-w-3xl leading-relaxed text-slate-600">The Veda 360° Student Journey connects the stages. Your Student Passport brings the milestones together. Explore the programmes below and discuss the support available for your goals.</p></JourneyReveal>
                </div>
            </section>

            <section id="veda-360" aria-labelledby="veda-360-heading" className="scroll-mt-20 px-5 pb-14 md:px-8 md:pb-20">
                <JourneyReveal className="mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] bg-primary lg:grid-cols-2">
                    <div className="p-7 sm:p-10 lg:p-12">
                        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-accent">01 / The umbrella programme</p>
                        <h2 id="veda-360-heading" className="text-3xl leading-tight text-white md:text-4xl">{PROGRAMS[0].title}</h2>
                        <p className="mt-5 text-base leading-relaxed text-white/75">{PROGRAMS[0].description}</p>
                        <ol className="my-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {['Discover', 'Choose', 'Apply', 'Settle', 'Connect', 'Advance'].map((stage, index) => <li key={stage} className="rounded-xl border border-white/15 px-4 py-3 text-sm text-white"><span className="mr-2 font-display text-accent" aria-hidden="true">0{index + 1}</span>{stage}</li>)}
                        </ol>
                        <Link href="/student-journey" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/50 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Explore the Student Journey <ArrowUpRight size={16} aria-hidden="true" /></Link>
                    </div>
                    <div className="relative min-h-80 lg:min-h-full"><Image src="/images/programs/veda-360.webp" alt="Two students arriving at a university entrance, ready for their next chapter" fill sizes="(min-width: 1024px) 640px, 100vw" className="object-cover" /></div>
                </JourneyReveal>
            </section>

            <section id="student-passport" aria-labelledby="student-passport-heading" className="scroll-mt-20 bg-muted px-5 py-16 md:px-8 md:py-20">
                <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
                    <JourneyReveal><p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">02 / Your personal roadmap</p><h2 id="student-passport-heading" className="text-3xl md:text-4xl">{PROGRAMS[1].title}</h2><p className="mt-5 text-base leading-relaxed text-slate-600">{PROGRAMS[1].description}</p><p className="mt-4 text-base leading-relaxed text-slate-600">Use it to keep your education goals and practical tasks connected as you move from discovery to graduate preparation.</p><Link href="/contact?type=student" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-white hover:bg-[#742493] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary">Discuss Your Student Passport <ArrowUpRight size={16} aria-hidden="true" /></Link></JourneyReveal>
                    <JourneyReveal delay={0.1}>
                        <div className="rounded-3xl border border-secondary/15 bg-white p-6 shadow-xl shadow-primary/5 sm:p-8">
                            <div className="mb-6 flex items-center justify-between border-b border-secondary/15 pb-5"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Veda Student Passport</p><p className="mt-2 font-display text-3xl italic text-primary">Your next chapter, organised.</p></div><NotebookPen className="ml-3 h-8 w-8 shrink-0 text-secondary" strokeWidth={1.3} aria-hidden="true" /></div>
                            <p className="mb-5 text-xs font-medium uppercase tracking-widest text-slate-500">Inside your personalised plan</p>
                            <ul className="space-y-4">{['Goals & assessment insights', 'Shortlisted courses', 'Scholarship deadlines', 'Application milestones', 'Accommodation tasks', 'Career-development targets'].map(item => <li key={item} className="flex items-center gap-3 text-sm text-slate-600"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-secondary"><Check size={13} aria-hidden="true" /></span>{item}</li>)}</ul>
                        </div>
                    </JourneyReveal>
                </div>
            </section>

            <section className="px-5 py-16 md:px-8 md:py-20" aria-labelledby="program-experiences-heading">
                <div className="mx-auto max-w-7xl">
                    <JourneyReveal className="mb-9"><p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Explore, connect, prepare</p><h2 id="program-experiences-heading" className="text-3xl md:text-4xl">Experiences that support your growth.</h2></JourneyReveal>
                    <div className="grid gap-6 md:grid-cols-2 md:gap-8">
                        {PROGRAMS.slice(2).map((program, index) => {
                            const experience = experiences[index];
                            const Icon = icons[index + 2];
                            return <JourneyReveal key={program.title} delay={(index % 2) * 0.06}>
                                <article id={programIds[index + 2]} aria-labelledby={`${programIds[index + 2]}-heading`} className="flex h-full scroll-mt-24 flex-col overflow-hidden rounded-3xl border border-secondary/15 bg-white shadow-sm">
                                    <div className="relative aspect-[16/9] bg-muted"><Image src={experience.image} alt={experience.alt} fill sizes="(min-width: 768px) 600px, 100vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-primary/75 to-transparent" /><span className="absolute bottom-5 left-6 rounded-full border border-white/40 bg-primary/30 px-3 py-2 text-xs font-medium text-white">{experience.label}</span></div>
                                    <div className="flex flex-1 flex-col p-6 sm:p-8"><div className="mb-4 flex items-center gap-3 text-secondary"><Icon size={20} aria-hidden="true" /><span className="text-xs font-semibold uppercase tracking-[0.16em]">Program 0{index + 3}</span></div><h3 id={`${programIds[index + 2]}-heading`} className="text-2xl leading-snug">{program.title}</h3><p className="mb-5 mt-4 text-base leading-relaxed text-slate-600">{program.description}</p><p className="mb-6 border-l-2 border-secondary/25 pl-4 text-sm leading-relaxed text-slate-500">{experience.note}</p><Link href={experience.link} className="mt-auto inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-semibold text-secondary hover:underline focus-visible:outline-2 focus-visible:outline-offset-4">Explore {experience.linkLabel} <ArrowUpRight className="shrink-0" size={16} aria-hidden="true" /></Link></div>
                                </article>
                            </JourneyReveal>;
                        })}
                    </div>
                </div>
            </section>

            <section className="bg-muted px-5 py-12 md:px-8" aria-labelledby="program-availability-heading"><JourneyReveal className="mx-auto max-w-5xl"><h2 id="program-availability-heading" className="mb-4 text-2xl">Built around you, with clear expectations.</h2><p className="text-base leading-relaxed text-slate-600">Programmes bring together guidance and experiences across the five service pillars. The scope, availability and eligibility for your plan are agreed with you. Networks and partner-led opportunities develop as participating students, alumni, academics and employers join. Admissions, funding, accommodation and career outcomes remain with the relevant providers; they are never guaranteed.</p></JourneyReveal></section>
            <OfferingCTA title="Make your next chapter a considered one." description="Explore the programmes that fit your goals, and talk to us about a practical roadmap for your student journey." secondaryHref="/services" secondaryLabel="Explore Our Services" />
        </div>
    );
}
