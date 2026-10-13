import { Metadata } from 'next';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight, Compass, HeartHandshake, Sparkles } from 'lucide-react';
import JourneyReveal from '@/components/students/JourneyReveal';
import styles from './journey.module.css';

// Copy from the client content brief (§1–§3, §9). Stage 03 is titled "Apply"
// to match the brief's journey line (Discover → Choose → Apply → …); the
// brief's homepage section calls it "Achieve". Pending client confirmation.
export const metadata: Metadata = {
    alternates: { canonical: '/student-journey' },
    title: 'Our Student Journey',
    description:
        'Discover, Choose, Apply, Settle, Connect, Advance: how Veda Scholars supports students before, during and after enrolment.',
};

const phases = [
    {
        label: 'Before you enrol',
        image: '/images/students/counselling.png',
        imageAlt: 'A young student exploring education options with a counsellor',
        caption: 'Find a direction that feels like you.',
        stages: [
            {
                number: '01',
                name: 'Discover',
                title: 'Know Yourself',
                text: 'Understand your interests, strengths, aptitude and aspirations through career discovery, assessment and personalised education planning.',
            },
            {
                number: '02',
                name: 'Choose',
                title: 'Find the Right University',
                text: 'Compare courses, universities, costs, scholarships and student experiences to make a considered choice.',
            },
            {
                number: '03',
                name: 'Apply',
                title: 'Navigate the University Process',
                text: 'Get structured guidance through applications, documents, offers, scholarship processes and pre-departure planning.',
            },
        ],
    },
    {
        label: 'Starting university',
        image: '/images/students/campus.png',
        imageAlt: 'Young students walking together on a university campus',
        caption: 'A new place. A new chapter.',
        stages: [
            {
                number: '04',
                name: 'Settle',
                title: 'Feel at Home',
                text: 'Prepare for accommodation, arrival, local orientation and the practical realities of student life.',
            },
        ],
    },
    {
        label: 'During your studies and beyond',
        image: '/images/students/graduation.png',
        imageAlt: 'A smiling graduate celebrating with family and friends',
        caption: 'Grow into your next possibility.',
        stages: [
            {
                number: '05',
                name: 'Connect',
                title: 'Build Your Network',
                text: 'Explore peer connections, alumni, academic conversations, mentoring, research exposure and industry networking.',
            },
            {
                number: '06',
                name: 'Advance',
                title: 'Build Your Career',
                text: 'Prepare for internships, lawful part-time work where eligible, career development and graduate opportunities.',
            },
        ],
    },
];

export default function StudentJourneyPage() {
    return (
        <div className="min-h-screen bg-white">
            <section className={`relative overflow-hidden ${styles.hero}`}>
                <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 md:px-8 md:py-20 lg:grid-cols-2 lg:gap-16">
                    <JourneyReveal>
                        <p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-secondary">
                            <span className="h-px w-8 bg-secondary" aria-hidden="true" /> Our Student Journey
                        </p>
                        <h1 className="text-5xl font-heading font-bold leading-[1.08] tracking-tight text-primary sm:text-6xl lg:text-7xl">
                            Education<br />Beyond <span className="font-display font-normal italic text-secondary">Admissions.</span>
                        </h1>
                        <p className="mt-7 max-w-lg text-lg leading-relaxed text-slate-600 md:text-xl">
                            Discover yourself. Choose your path. Build your future.
                        </p>
                        <div className="mt-9 flex flex-wrap items-center gap-6">
                            <Button href="/contact?type=student" size="lg" className="rounded-full text-base">
                                Start Your Student Journey <ArrowUpRight className="ml-2 h-5 w-5" aria-hidden="true" />
                            </Button>
                            <Link href="#journey-stages-heading" className="inline-flex items-center gap-2 rounded-md py-2 text-sm font-semibold text-primary hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary">
                                Explore the journey <ArrowDown size={16} aria-hidden="true" />
                            </Link>
                        </div>
                        <div className="mt-10 flex items-center gap-3 border-t border-secondary/15 pt-6 text-sm text-slate-600">
                            <Compass size={20} className="shrink-0 text-secondary" aria-hidden="true" />
                            For your next chapter, in India and abroad.
                        </div>
                    </JourneyReveal>
                    <JourneyReveal delay={0.12} className="relative mx-auto w-full max-w-xl pb-12 pl-5 sm:pl-8">
                        <div className="absolute inset-4 rounded-[3rem] border border-secondary/20 rotate-3" aria-hidden="true" />
                        <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] bg-muted shadow-xl shadow-primary/10 lg:aspect-[4/5] lg:max-h-[560px]">
                            <Image src="/images/students/campus.png" alt="Young university students sharing a conversation on a sunny campus" fill sizes="(min-width: 1024px) 560px, (min-width: 640px) 576px, 95vw" loading="eager" className="object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent" />
                            <p className="absolute bottom-8 left-7 max-w-[65%] font-display text-3xl italic leading-tight text-white sm:text-4xl">Your future starts<br />with you.</p>
                        </div>
                        <div className={`absolute bottom-0 right-0 w-32 overflow-hidden rounded-2xl border-[6px] border-white shadow-xl sm:w-40 ${styles.portrait}`}>
                            <div className="relative aspect-[4/5]">
                                <Image src="/images/students/graduation.png" alt="A young graduate celebrating her achievement" fill sizes="160px" className="object-cover" />
                            </div>
                        </div>
                        <div className="absolute -left-1 top-7 flex items-center gap-2 rounded-full border border-secondary/10 bg-white px-4 py-3 text-xs font-semibold text-primary shadow-lg sm:top-12 sm:text-sm">
                            <Sparkles size={16} className="text-secondary" aria-hidden="true" /> So much ahead of you
                        </div>
                    </JourneyReveal>
                </div>
            </section>

            <section className="bg-white py-14 md:py-20">
                <JourneyReveal className="mx-auto grid max-w-6xl gap-8 px-5 md:grid-cols-[0.8fr_1.2fr] md:gap-16 md:px-8">
                    <div>
                        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">More than an offer letter</p>
                        <h2 className="text-3xl leading-tight md:text-4xl">A journey built<br />around <span className="font-display font-normal italic text-secondary">you.</span></h2>
                    </div>
                    <div className="space-y-5 text-base leading-relaxed text-slate-600 md:text-lg">
                        <p>Choosing a university is about more than receiving an offer. It is about discovering the right direction, understanding your options, finding funding opportunities, preparing for student life and building a foundation for your future career.</p>
                        <p>We help students pursuing undergraduate and postgraduate education in India and abroad make informed choices and prepare for what comes next. Our support is designed around the student, not just the admission.</p>
                    </div>
                </JourneyReveal>
            </section>

            <section className="bg-muted py-16 md:py-24" aria-labelledby="journey-stages-heading">
                <div className="mx-auto max-w-6xl px-5 md:px-8">
                    <JourneyReveal className="mb-12 text-center md:mb-16">
                        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">With you at every chapter</p>
                        <h2 id="journey-stages-heading" className="scroll-mt-28 text-3xl md:text-4xl">Six stages, one connected journey</h2>
                        <p className="mx-auto mt-5 max-w-2xl text-sm leading-loose text-slate-600 md:text-base">Discover → Choose → Apply → Settle → Connect → Advance</p>
                    </JourneyReveal>
                    <div className="space-y-10 md:space-y-14">
                        {phases.map((phase, phaseIndex) => (
                            <div key={phase.label} className="grid gap-6 lg:grid-cols-[0.85fr_1.4fr] lg:gap-10">
                                <JourneyReveal className="relative min-h-72 overflow-hidden rounded-3xl bg-primary sm:min-h-80">
                                    <Image src={phase.image} alt={phase.imageAlt} fill sizes="(min-width: 1024px) 420px, (min-width: 640px) 700px, 100vw" className="object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/10 to-transparent" />
                                    <div className="absolute inset-x-0 bottom-0 p-7 md:p-8">
                                        <span className="mb-3 inline-block rounded-full border border-white/40 bg-primary/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white">Chapter 0{phaseIndex + 1}</span>
                                        <p className="font-display text-3xl italic leading-tight text-white">{phase.caption}</p>
                                    </div>
                                </JourneyReveal>
                                <div>
                                    <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">{phase.label}</h3>
                                    <ol className="space-y-4">
                                        {phase.stages.map((stage, index) => (
                                            <li key={stage.number}>
                                                <JourneyReveal delay={index * 0.06}>
                                                    <div className={`flex gap-4 rounded-2xl border border-secondary/10 bg-white p-5 md:gap-6 md:p-6 ${styles.stage}`}>
                                                        <span className="shrink-0 font-display text-3xl text-secondary/70 md:text-4xl" aria-hidden="true">{stage.number}</span>
                                                        <div>
                                                            <h4 className="mb-2 text-lg font-bold text-primary md:text-xl">
                                                                <span className="sr-only">Stage {stage.number}: </span>{stage.name} <span className="font-normal text-slate-600">— {stage.title}</span>
                                                            </h4>
                                                            <p className="text-sm leading-relaxed text-slate-600 md:text-base">{stage.text}</p>
                                                        </div>
                                                    </div>
                                                </JourneyReveal>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="mx-auto mt-12 max-w-3xl text-center text-sm leading-relaxed text-slate-600">
                        Campus tours, conversations with students, alumni and academics, and networking or industry activities depend on participating people and institutions, and are offered where available.
                    </p>
                </div>
            </section>

            <section className="bg-white py-16 md:py-20" aria-labelledby="journey-commitment-heading">
                <JourneyReveal className="mx-auto grid max-w-6xl gap-8 px-5 md:grid-cols-[0.8fr_1.2fr] md:gap-16 md:px-8">
                    <div>
                        <HeartHandshake className="mb-5 h-10 w-10 text-secondary" strokeWidth={1.4} aria-hidden="true" />
                        <h2 id="journey-commitment-heading" className="text-3xl md:text-4xl">Our commitment<br />to you</h2>
                    </div>
                    <ul className="space-y-5 text-base leading-relaxed text-slate-600">
                        <li className="border-b border-secondary/10 pb-5">Practical guidance to help you and your family make informed education decisions.</li>
                        <li className="border-b border-secondary/10 pb-5">Clarity about what Veda Scholars delivers directly and what is provided by universities or third-party partners.</li>
                        <li>No promises we cannot keep: we never guarantee admissions, scholarships, visa outcomes, accommodation, internships or jobs. Those decisions rest with universities, funders, employers and the relevant authorities.</li>
                    </ul>
                </JourneyReveal>
            </section>

            <section className="relative overflow-hidden bg-primary py-16 md:py-24">
                <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10" aria-hidden="true" />
                <div className="pointer-events-none absolute -bottom-40 -left-16 h-96 w-96 rounded-full border border-white/10" aria-hidden="true" />
                <JourneyReveal className="relative mx-auto max-w-3xl px-5 text-center md:px-8">
                    <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-accent">Your next chapter is waiting</p>
                    <h2 className="mb-6 text-3xl text-white md:text-5xl">Start your student journey</h2>
                    <p className="mx-auto mb-9 max-w-2xl text-lg leading-relaxed text-white/75">Tell us where you are now and what you are considering. We will help you plan the next step.</p>
                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <Button variant="primary" size="lg" href="/contact?type=student" className="rounded-full text-base">Start Your Student Journey <ArrowUpRight className="ml-2 h-5 w-5" aria-hidden="true" /></Button>
                        <Button variant="outline" size="lg" href="/services" className="rounded-full border-white/60 text-base hover:bg-white/10">Explore Our Services</Button>
                    </div>
                </JourneyReveal>
            </section>
        </div>
    );
}
