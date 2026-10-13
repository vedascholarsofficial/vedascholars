import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, BookOpen, Wallet, FileCheck, House } from 'lucide-react';
import JourneyReveal from '@/components/students/JourneyReveal';

// Copy from the client content brief (§1, §4, §6 "For Parents", §9). Services
// the brief schedules for later phases are described as "where offered".
export const metadata: Metadata = {
    alternates: { canonical: '/for-parents' },
    title: 'For Parents',
    description:
        'Clear information for parents and families on course suitability, costs, scholarships, accommodation and student wellbeing.',
};

const topics = [
    {
        title: 'Course and university choices',
        text: 'Compare courses and universities using academic fit, entry requirements, cost, location and future aspirations.',
    },
    {
        title: 'Costs and funding',
        text: 'Compare tuition, living costs, travel and other expenses, estimate funding gaps and explore relevant scholarship opportunities, eligibility requirements and deadlines. Career and salary outcomes are discussed as scenarios, not guarantees.',
    },
    {
        title: 'Applications and offers',
        text: 'Course shortlisting, application planning, document checklists, personal statement guidance and offer comparison.',
    },
    {
        title: 'Accommodation and settling in',
        text: 'Guidance on housing options, budget, location, tenancy questions and scam awareness, plus practical preparation for travel, university registration, local services and everyday life. Referrals or booking assistance only where actually available.',
    },
];

const topicIcons = [BookOpen, Wallet, FileCheck, House];

export default function ForParentsPage() {
    return (
        <div className="min-h-screen bg-white">
            <section className="bg-[#faf9f6] px-5 py-14 md:px-8 md:py-20">
                <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
                    <JourneyReveal>
                        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#60736a]">For Parents</p>
                        <h1 className="text-4xl leading-[1.12] text-[#252c29] sm:text-5xl lg:text-6xl">Supporting your family&apos;s decision</h1>
                        <div className="my-7 h-px w-14 bg-[#b5c0b7]" aria-hidden="true" />
                        <p className="max-w-xl text-lg leading-relaxed text-slate-600">
                            We help students and families make informed education decisions and navigate the journey from
                            career discovery to university and beyond.
                        </p>
                        <Link href="/contact?type=student" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#742493] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary">Contact Us <ArrowUpRight size={17} aria-hidden="true" /></Link>
                    </JourneyReveal>
                    <JourneyReveal delay={0.1}>
                        <figure>
                            <div className="relative aspect-[5/4] overflow-hidden rounded-3xl bg-[#eeece5]">
                                <Image src="/images/parents/family-planning.webp" alt="Parents and their university-age daughter discussing her study plans together at home" fill loading="eager" sizes="(min-width: 1024px) 520px, (min-width: 640px) 720px, 100vw" className="object-cover" />
                            </div>
                            <figcaption className="mt-4 text-sm text-[#60736a]">A shared decision. A considered next step.</figcaption>
                        </figure>
                    </JourneyReveal>
                </div>
            </section>

            <section className="px-5 py-16 md:px-8 md:py-20" aria-labelledby="parents-topics-heading">
                <div className="mx-auto max-w-6xl">
                    <JourneyReveal className="mb-9 max-w-3xl">
                        <h2 id="parents-topics-heading" className="mb-4 text-3xl leading-tight text-[#252c29] md:text-4xl">Clear information on what matters</h2>
                        <p className="text-lg leading-relaxed text-slate-600">Course suitability, costs, scholarships, accommodation and student wellbeing.</p>
                    </JourneyReveal>
                    <ul className="grid gap-5 md:grid-cols-2">
                        {topics.map((topic, index) => {
                            const Icon = topicIcons[index];
                            return <li key={topic.title}>
                                <JourneyReveal delay={(index % 2) * 0.05} className="h-full">
                                    <div className="h-full rounded-2xl border border-[#e7e9e4] bg-[#fafbf9] p-6 md:p-8">
                                        <Icon className="mb-5 h-6 w-6 text-[#60736a]" strokeWidth={1.5} aria-hidden="true" />
                                        <h3 className="mb-3 text-xl text-[#252c29]">{topic.title}</h3>
                                        <p className="text-base leading-relaxed text-slate-600">{topic.text}</p>
                                    </div>
                                </JourneyReveal>
                            </li>;
                        })}
                    </ul>
                </div>
            </section>

            <section className="bg-[#f5f6f2] px-5 py-16 md:px-8 md:py-20" aria-labelledby="parents-communication-heading">
                <div className="mx-auto grid max-w-6xl items-center gap-9 lg:grid-cols-2 lg:gap-14">
                    <JourneyReveal className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-[#eeece5]">
                        <Image src="/images/parents/family-check-in.webp" alt="A mother and her university-age son having a relaxed conversation on a leafy terrace" fill sizes="(min-width: 1024px) 540px, (min-width: 640px) 720px, 100vw" className="object-cover" />
                    </JourneyReveal>
                    <JourneyReveal delay={0.08}>
                        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#60736a]">Communication with care</p>
                        <h2 id="parents-communication-heading" className="mb-6 text-3xl leading-tight text-[#252c29] md:text-4xl">How we keep families informed</h2>
                        <p className="text-lg leading-relaxed text-slate-600">
                            Where offered, Parent Connect provides a parent orientation and agreed check-ins on the
                            student&apos;s progress. These respect the student&apos;s consent and privacy. Please ask us
                            what is currently available for your family.
                        </p>
                    </JourneyReveal>
                </div>
            </section>

            <section className="px-5 py-16 md:px-8 md:py-20" aria-labelledby="parents-boundaries-heading">
                <JourneyReveal className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-14">
                    <div>
                        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#60736a]">Clear expectations</p>
                        <h2 id="parents-boundaries-heading" className="text-3xl leading-tight text-[#252c29]">Privacy and support boundaries</h2>
                    </div>
                    <ul className="list-disc space-y-5 pl-5 text-base leading-relaxed text-slate-600 marker:text-[#8b9b8f]">
                        <li>
                            We handle student and parent information with consent, as described in our{' '}
                            <Link href="/privacy-policy" className="rounded-sm underline underline-offset-4 hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary">privacy policy</Link>.
                        </li>
                        <li>We make clear what Veda Scholars delivers directly and what is provided by universities or third-party partners.</li>
                        <li>For visa questions, we help students understand relevant processes, requirements and checklists, and refer to qualified or official sources where appropriate.</li>
                        <li>We never guarantee admissions, scholarships, visa outcomes, accommodation availability, internships or jobs. Those decisions rest with universities, funders, employers and the relevant authorities.</li>
                    </ul>
                </JourneyReveal>
            </section>

            <section className="border-t border-[#e8e5dd] bg-[#f7f5ef] px-5 py-14 md:px-8 md:py-16">
                <JourneyReveal className="mx-auto flex max-w-6xl flex-col justify-between gap-8 lg:flex-row lg:items-center">
                    <div className="max-w-xl">
                        <h2 className="mb-4 text-3xl text-[#252c29] md:text-4xl">Talk to Veda Scholars</h2>
                        <p className="text-lg leading-relaxed text-slate-600">Tell us about your child&apos;s plans and questions. We will explain the options and the next steps.</p>
                    </div>
                    <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                        <Link href="/contact?type=student" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#742493] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary">Contact Us <ArrowUpRight size={17} aria-hidden="true" /></Link>
                        <Link href="/student-journey" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#a9b4ac] px-6 py-3 text-sm font-semibold text-[#354b3f] transition-colors hover:bg-[#e9ede5] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#60736a]">See the Student Journey</Link>
                    </div>
                </JourneyReveal>
            </section>
        </div>
    );
}
