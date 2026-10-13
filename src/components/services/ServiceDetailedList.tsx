import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import JourneyReveal from '@/components/students/JourneyReveal';
import { SERVICE_PILLARS } from '@/lib/student-offerings';
import PillarBrowser from './PillarBrowser';
import ServiceCard from './ServiceCard';

const imageAlts = [
    'A young student comparing course brochures and planning her education',
    'A student and his mother planning education costs together',
    'A student unpacking and making her university accommodation feel like home',
    'University students collaborating on a research prototype in a makerspace',
    'A student discussing his portfolio with a career mentor',
];

export default function ServiceDetailedList() {
    return (
        <>
            <section id="service-pillars" aria-labelledby="pillars-heading" className="scroll-mt-24 px-5 py-14 md:px-8">
                <div className="mx-auto max-w-7xl">
                    <JourneyReveal className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                        <div><p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Find your starting point</p><h2 id="pillars-heading" className="text-3xl md:text-4xl">Five pillars. One connected journey.</h2></div>
                        <Link href="/programs" className="inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-semibold text-secondary hover:underline focus-visible:outline-2 focus-visible:outline-offset-4">Explore our Programs <ArrowUpRight size={16} aria-hidden="true" /></Link>
                    </JourneyReveal>
                </div>
            </section>
            <PillarBrowser>
            {SERVICE_PILLARS.map((pillar, index) => (
                <section key={pillar.id} id={pillar.id} aria-labelledby={`${pillar.id}-heading`} className={`scroll-mt-20 px-5 py-14 md:px-8 md:py-20 ${index % 2 === 0 ? 'bg-muted/65' : 'bg-white'}`}>
                    <div className="mx-auto grid max-w-7xl gap-9 lg:grid-cols-[0.8fr_1.55fr] lg:gap-12">
                        <JourneyReveal from="right">
                            <p className="mb-3 hidden text-xs font-semibold uppercase tracking-[0.2em] text-secondary md:block">Pillar {Number(pillar.number)}</p>
                            <h2 id={`${pillar.id}-heading`} className="text-3xl leading-tight md:text-4xl">{pillar.title}</h2>
                            <p className="mb-6 mt-4 text-base leading-relaxed text-slate-600">{pillar.summary}</p>
                            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-muted">
                                <Image src={pillar.image} alt={imageAlts[index]} fill sizes="(min-width: 1024px) 400px, (min-width: 640px) 650px, 100vw" className="object-cover" />
                            </div>
                            <details open className="group mt-5 rounded-2xl border border-secondary/10 bg-white p-5 md:hidden">
                                <summary className="cursor-pointer text-sm font-semibold text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary">Who it is for &amp; what you receive</summary>
                                <dl className="mt-4 space-y-4 text-sm leading-relaxed">
                                    <div><dt className="mb-1 font-semibold text-primary">Who it is for</dt><dd className="text-slate-600">{pillar.audience}</dd></div>
                                    <div><dt className="mb-1 font-semibold text-primary">What we can help you prepare</dt><dd className="text-slate-600">{pillar.deliverable}</dd></div>
                                </dl>
                            </details>
                            <dl className="mt-6 hidden space-y-5 rounded-2xl border border-secondary/10 bg-white p-5 text-sm leading-relaxed md:block">
                                <div><dt className="mb-2 text-xs font-semibold uppercase tracking-widest text-secondary">Who it is for</dt><dd className="text-slate-600">{pillar.audience}</dd></div>
                                <div><dt className="mb-2 text-xs font-semibold uppercase tracking-widest text-secondary">What we can help you prepare</dt><dd className="text-slate-600">{pillar.deliverable}</dd></div>
                            </dl>
                        </JourneyReveal>
                        <div>
                            <div className="grid gap-3 md:grid-cols-2 md:gap-4">
                                {pillar.services.map((service, serviceIndex) => (
                                    <JourneyReveal key={service.title} from="right" delay={serviceIndex * 0.08} className="h-full">
                                        <ServiceCard title={service.title} description={service.description} group={`services-${pillar.id}`} />
                                    </JourneyReveal>
                                ))}
                            </div>
                            <Link href="/contact?type=student" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full border border-secondary/25 px-5 py-3 text-sm font-semibold text-secondary transition-colors hover:bg-secondary/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary">Discuss {pillar.title} <ArrowUpRight size={16} aria-hidden="true" /></Link>
                        </div>
                    </div>
                </section>
            ))}
            </PillarBrowser>
            <section className="px-5 py-16 md:px-8 md:py-20" aria-labelledby="service-process-heading">
                <div className="mx-auto max-w-6xl">
                    <JourneyReveal><p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">A clear next step</p><h2 id="service-process-heading" className="mb-8 text-3xl md:text-4xl">How we plan your support</h2></JourneyReveal>
                    <ol className="grid gap-6 md:grid-cols-3">
                        {[
                            ['Share your starting point', 'Tell us your study level, interests, intended destination and the support you need.'],
                            ['Agree a practical plan', 'We discuss relevant services, availability, delivery responsibilities and the milestones that matter to you.'],
                            ['Prepare for what comes next', 'Use your agreed roadmap, checklists and resources to work through the next stage of your journey.'],
                        ].map(([title, text], index) => <li key={title}><JourneyReveal delay={index * 0.06}><span className="font-display text-3xl text-secondary" aria-hidden="true">0{index + 1}</span><h3 className="mb-2 mt-4 text-lg">{title}</h3><p className="text-sm leading-relaxed text-slate-600">{text}</p></JourneyReveal></li>)}
                    </ol>
                    <div className="mt-12 rounded-3xl bg-muted p-6 md:p-9">
                        <h3 className="mb-3 text-xl">Practical support, clear expectations</h3>
                        <p className="text-sm leading-relaxed text-slate-600">We explain what Veda Scholars delivers directly and what depends on universities or third-party partners, including relevant partnership or referral arrangements. Student conversations, academic sessions, tours, networking and opportunities depend on participating people and institutions. Availability and eligibility are discussed before you commit.</p>
                        <p className="mt-4 text-sm leading-relaxed text-slate-600">We never guarantee admissions, scholarships, visa outcomes, accommodation, internships, jobs or assistantships. These decisions rest with the relevant institutions, funders, employers and authorities. Work permissions depend on your immigration status and course conditions; we refer you to current official or qualified sources where appropriate.</p>
                    </div>
                    <div className="mt-12" aria-labelledby="services-faq-heading">
                        <h2 id="services-faq-heading" className="mb-6 text-2xl md:text-3xl">Questions before you begin</h2>
                        {[
                            ['Do I need support across all five pillars?', 'Your plan should reflect your current stage and goals. Discuss the services relevant to you and agree the scope before beginning.'],
                            ['Are tours, academic sessions and opportunities always available?', 'No. They depend on participating institutions, students, academics and partners. We discuss current availability and eligibility with you.'],
                            ['Can my parents be involved?', 'Parent orientation and agreed progress check-ins respect student consent and privacy. We agree communication expectations with you.'],
                        ].map(([question, answer]) => <details key={question} className="border-b border-secondary/15 py-5"><summary className="cursor-pointer rounded-md pr-4 font-semibold text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary">{question}</summary><p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">{answer}</p></details>)}
                    </div>
                </div>
            </section>
        </>
    );
}
