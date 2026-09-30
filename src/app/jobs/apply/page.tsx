import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import FadeIn from '@/components/animations/FadeIn';
import FaqAccordion from '@/components/jobs/ApplyPageClient';
import {
    Globe,
    ShieldCheck,
    UserCheck,
    Zap,
    HeadphonesIcon,
    BadgeCheck,
    FileText,
    Search,
    Handshake,
    ExternalLink,
    ArrowRight,
    CheckCircle,
    Clock,
    Shield,
} from 'lucide-react';

// ── SEO Metadata ─────────────────────────────────────────────────────────────

export const metadata: Metadata = {
    title: 'Apply for Jobs | International Recruitment — Veda Scholars',
    description:
        'Apply for international jobs through Veda Scholars. Access visa-sponsored roles in the UK, UAE, and India. Submit your resume today — free of charge. Trusted by 500+ candidates.',
    keywords: [
        'apply for jobs',
        'international jobs',
        'visa sponsored jobs',
        'job application',
        'recruitment agency India UK UAE',
        'study and work abroad',
        'global employment',
        'overseas job placement',
    ],
    openGraph: {
        title: 'Apply for International Jobs | Veda Scholars Recruitment',
        description:
            'Submit your job application to Veda Scholars and get matched with verified employers in the UK, UAE, and India. Visa-sponsored roles. Free to apply.',
        url: 'https://vedascholars.com/jobs/apply',
        siteName: 'Veda Scholars',
        type: 'website',
        images: [
            {
                url: '/opengraph-image.png',
                width: 1200,
                height: 630,
                alt: 'Apply for International Jobs — Veda Scholars Recruitment',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Apply for International Jobs | Veda Scholars',
        description:
            'Join 500+ candidates. Submit your resume for visa-sponsored international jobs in the UK, UAE & India.',
        images: ['/opengraph-image.png'],
    },
    alternates: {
        canonical: 'https://vedascholars.com/jobs/apply',
    },
};

// ── Static data ──────────────────────────────────────────────────────────────

const GOOGLE_FORM_URL = 'https://forms.gle/jhHH8YBx1cfeT6ZX8';

const features = [
    {
        icon: Globe,
        title: 'Global Employer Network',
        description:
            'Access thousands of verified job openings across India, the UK, UAE, and beyond through our curated international employer partnerships.',
        color: 'bg-blue-100 text-blue-700',
    },
    {
        icon: ShieldCheck,
        title: 'Visa-Sponsored Roles',
        description:
            'We specialise in matching candidates with employers who offer full visa sponsorship for roles in the UK, UAE, and GCC countries.',
        color: 'bg-emerald-100 text-emerald-700',
    },
    {
        icon: UserCheck,
        title: 'Career Counseling',
        description:
            'Receive one-on-one guidance from our experienced career advisors who align your profile with the right international opportunities.',
        color: 'bg-amber-100 text-amber-700',
    },
    {
        icon: BadgeCheck,
        title: 'Verified Recruiters',
        description:
            'Every employer on our network is thoroughly vetted. No scams, no fake listings — only authentic, credible recruitment opportunities.',
        color: 'bg-purple-100 text-purple-700',
    },
    {
        icon: Zap,
        title: 'Fast Screening Process',
        description:
            'Our assisted shortlisting ensures your profile reaches the right employer desk within days, not weeks.',
        color: 'bg-rose-100 text-rose-700',
    },
    {
        icon: HeadphonesIcon,
        title: 'International Placement Support',
        description:
            'From application to onboarding, our team provides end-to-end support including document preparation and pre-departure guidance.',
        color: 'bg-cyan-100 text-cyan-700',
    },
];

const steps = [
    {
        number: '01',
        icon: FileText,
        title: 'Submit Your Resume',
        description:
            'Click "Apply Now" to open our secure application form. Upload your CV and fill in your details — it takes less than 5 minutes.',
    },
    {
        number: '02',
        icon: Search,
        title: 'Profile Screening',
        description:
            'Our recruiters evaluate your skills, experience, and career goals to match you with the most suitable international opportunities.',
    },
    {
        number: '03',
        icon: Handshake,
        title: 'Employer Matching',
        description:
            'You are introduced to verified employers seeking profiles like yours. We coordinate interviews and guide you through the offer stage.',
    },
];

const trustBadges: string[] = [
    'No Registration Fee',
    'Trusted by 500+ Candidates',
    'Verified Employers Only',
];

const applyBenefits: { icon: React.ElementType; text: string }[] = [
    { icon: Clock, text: 'Takes less than 5 minutes' },
    { icon: Shield, text: 'Your data is 100% secure' },
    { icon: CheckCircle, text: 'Free — no hidden charges' },
    { icon: Globe, text: 'Opportunities in 10+ countries' },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ApplyForJobsPage() {
    return (
        <div className="bg-white min-h-screen">

            {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
            <nav aria-label="Breadcrumb" className="bg-slate-50 border-b border-slate-200 py-3">
                <div className="container mx-auto px-4 md:px-6">
                    <ol
                        className="flex items-center gap-2 text-sm text-slate-300"
                        itemScope
                        itemType="https://schema.org/BreadcrumbList"
                    >
                        <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                            <Link href="/" className="hover:text-[#24112D] transition-colors" itemProp="item">
                                <span itemProp="name">Home</span>
                            </Link>
                            <meta itemProp="position" content="1" />
                        </li>
                        <li aria-hidden="true" className="text-slate-300">/</li>
                        <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                            <span className="text-[#24112D] font-medium" itemProp="name">
                                Apply for Jobs
                            </span>
                            <meta itemProp="position" content="2" />
                        </li>
                    </ol>
                </div>
            </nav>

            {/* ── Section 1: Hero ─────────────────────────────────────────────────── */}
            <section className="relative py-24 md:py-32 bg-[#24112D] text-white overflow-hidden">
                <div
                    className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#8B2BB4]/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                />
                <div
                    className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#8B2BB4]/8 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3 pointer-events-none"
                    aria-hidden="true"
                />

                <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
                    <FadeIn>
                        <span className="inline-block py-1.5 px-4 rounded-full bg-[#8B2BB4]/20 border border-[#8B2BB4]/40 text-[#8B2BB4] text-sm font-medium mb-6 tracking-wide">
                            International Recruitment&nbsp;&nbsp;·&nbsp;&nbsp;India · UK · UAE
                        </span>

                        <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 text-white leading-tight">
                            Land Your Dream Job{' '}
                            <span className="text-[#8B2BB4]">Across the Globe</span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
                            Veda Scholars connects talented candidates with top international employers offering
                            visa‑sponsored roles in the UK, UAE, and beyond. Your career journey starts here.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                            <a
                                href={GOOGLE_FORM_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-md bg-[#8B2BB4] text-white font-semibold text-lg shadow-lg hover:bg-[#742493] active:scale-95 transition-all duration-300 hover:-translate-y-0.5"
                            >
                                Apply Now <ArrowRight className="w-5 h-5" aria-hidden="true" />
                            </a>
                            <Link
                                href="/counselling"
                                className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-md border-2 border-white/30 text-white font-semibold text-lg hover:border-[#8B2BB4] hover:text-[#8B2BB4] active:scale-95 transition-all duration-300 hover:-translate-y-0.5"
                            >
                                Book Counselling
                            </Link>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-slate-400">
                            {trustBadges.map((item) => (
                                <span key={item} className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-[#8B2BB4]" aria-hidden="true" />
                                    {item}
                                </span>
                            ))}
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ── Section 2: Why Apply Through Veda Scholars ──────────────────────── */}
            <section className="py-20 md:py-24 bg-slate-50" aria-labelledby="why-apply-heading">
                <div className="container mx-auto px-4 md:px-6">
                    <FadeIn>
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2
                                id="why-apply-heading"
                                className="text-3xl md:text-4xl font-heading font-bold text-[#24112D] mb-4"
                            >
                                Why Apply Through Veda Scholars?
                            </h2>
                            <p className="text-slate-300 text-lg leading-relaxed">
                                We are more than a recruitment agency. We are your international career partner —
                                from application to arrival.
                            </p>
                        </div>
                    </FadeIn>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, idx) => {
                            const Icon = feature.icon;
                            return (
                                <FadeIn key={feature.title} delay={idx * 0.08}>
                                    <article className="bg-white p-8 rounded-2xl border border-slate-100 hover:border-[#8B2BB4]/40 hover:shadow-lg transition-all duration-300 h-full group">
                                        <div
                                            className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                                        >
                                            <Icon className="w-6 h-6" aria-hidden="true" />
                                        </div>
                                        <h3 className="text-lg font-bold text-[#24112D] mb-3">{feature.title}</h3>
                                        <p className="text-slate-300 text-sm leading-relaxed">{feature.description}</p>
                                    </article>
                                </FadeIn>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── Section 3: How It Works ─────────────────────────────────────────── */}
            <section className="py-20 md:py-24 bg-white" aria-labelledby="how-it-works-heading">
                <div className="container mx-auto px-4 md:px-6">
                    <FadeIn>
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2
                                id="how-it-works-heading"
                                className="text-3xl md:text-4xl font-heading font-bold text-[#24112D] mb-4"
                            >
                                How Our Recruitment Process Works
                            </h2>
                            <p className="text-slate-300 text-lg leading-relaxed">
                                Three simple steps to international employment — clear, transparent, and
                                candidate‑first.
                            </p>
                        </div>
                    </FadeIn>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        <div
                            className="hidden md:block absolute top-10 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-[2px] bg-gradient-to-r from-[#8B2BB4]/20 via-[#8B2BB4] to-[#8B2BB4]/20 z-0"
                            aria-hidden="true"
                        />
                        {steps.map((step, idx) => {
                            const Icon = step.icon;
                            return (
                                <FadeIn key={step.number} delay={idx * 0.15}>
                                    <div className="relative z-10 text-center flex flex-col items-center">
                                        <div className="relative mb-6">
                                            <div className="w-20 h-20 rounded-full bg-[#24112D] flex items-center justify-center shadow-xl border-4 border-white ring-2 ring-[#8B2BB4]">
                                                <Icon className="w-8 h-8 text-[#8B2BB4]" aria-hidden="true" />
                                            </div>
                                            <span
                                                className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#8B2BB4] text-white text-xs font-bold flex items-center justify-center shadow"
                                                aria-hidden="true"
                                            >
                                                {step.number}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-[#24112D] mb-3">{step.title}</h3>
                                        <p className="text-slate-300 text-sm leading-relaxed max-w-xs mx-auto">
                                            {step.description}
                                        </p>
                                    </div>
                                </FadeIn>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── Section 4: Application CTA (replaces iframe) ─────────────────────── */}
            <section
                id="apply-form"
                className="py-20 md:py-24 bg-slate-50 scroll-mt-24"
                aria-labelledby="apply-cta-heading"
            >
                <div className="container mx-auto px-4 md:px-6">
                    <FadeIn>
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <span className="inline-block py-1 px-3 rounded-full bg-[#8B2BB4]/15 border border-[#8B2BB4]/30 text-[#8B2BB4] text-sm font-medium mb-4">
                                Step 1 of 3 — Submit Your Profile
                            </span>
                            <h2
                                id="apply-cta-heading"
                                className="text-3xl md:text-4xl font-heading font-bold text-[#24112D] mb-4"
                            >
                                Submit Your Job Application
                            </h2>
                            <p className="text-slate-300 text-lg leading-relaxed">
                                Click the button below to open our secure application form. Our recruiters will
                                review your profile within 5–10 business days.
                            </p>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.1}>
                        <div className="max-w-2xl mx-auto">
                            {/* Application card */}
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                                {/* Brand accent bar */}
                                <div className="h-1.5 bg-gradient-to-r from-[#24112D] via-[#8B2BB4] to-[#24112D]" />

                                <div className="p-8 md:p-12 text-center">
                                    {/* Icon badge */}
                                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#24112D] mb-6 shadow-lg ring-4 ring-[#8B2BB4]/20">
                                        <FileText className="w-9 h-9 text-[#8B2BB4]" aria-hidden="true" />
                                    </div>

                                    <h3 className="text-2xl font-heading font-bold text-[#24112D] mb-3">
                                        Ready to Apply?
                                    </h3>
                                    <p className="text-slate-300 mb-8 max-w-md mx-auto leading-relaxed">
                                        Our application form is quick, simple, and secure. You can attach your CV and
                                        tell us about your career goals in under 5 minutes.
                                    </p>

                                    {/* Benefit chips */}
                                    <div className="grid grid-cols-2 gap-3 mb-10 text-left max-w-sm mx-auto">
                                        {applyBenefits.map(({ icon: Icon, text }) => (
                                            <div key={text} className="flex items-center gap-2 text-sm text-slate-300">
                                                <Icon className="w-4 h-4 text-[#8B2BB4] flex-shrink-0" aria-hidden="true" />
                                                {text}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Primary CTA */}
                                    <a
                                        href={GOOGLE_FORM_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-3 h-14 px-10 rounded-md bg-[#8B2BB4] text-white font-bold text-lg shadow-lg hover:bg-[#742493] active:scale-95 transition-all duration-300 hover:-translate-y-0.5 w-full sm:w-auto"
                                        aria-label="Open Veda Scholars job application form in a new tab"
                                    >
                                        Open Application Form
                                        <ExternalLink className="w-5 h-5" aria-hidden="true" />
                                    </a>

                                    <p className="mt-5 text-xs text-slate-400 flex items-center justify-center gap-1.5">
                                        <Shield className="w-3.5 h-3.5 text-[#8B2BB4]" aria-hidden="true" />
                                        Secured by Google Forms · Your data is used only for recruitment purposes
                                    </p>
                                </div>
                            </div>

                            {/* Alternative contact */}
                            <p className="text-center mt-6 text-sm text-slate-300">
                                Prefer to send your CV directly?{' '}
                                <Link
                                    href="/contact"
                                    className="text-[#8B2BB4] font-semibold hover:underline underline-offset-4"
                                >
                                    Contact our team →
                                </Link>
                            </p>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ── Section 5: FAQ ──────────────────────────────────────────────────── */}
            <section className="py-20 md:py-24 bg-white" aria-labelledby="faq-heading">
                <div className="container mx-auto px-4 md:px-6">
                    <FadeIn>
                        <div className="text-center max-w-3xl mx-auto mb-14">
                            <h2
                                id="faq-heading"
                                className="text-3xl md:text-4xl font-heading font-bold text-[#24112D] mb-4"
                            >
                                Frequently Asked Questions
                            </h2>
                            <p className="text-slate-300 text-lg">
                                Everything you need to know before applying.
                            </p>
                        </div>
                    </FadeIn>

                    <FaqAccordion />

                    <FadeIn delay={0.15}>
                        <p className="text-center mt-10 text-slate-300 text-sm">
                            Still have questions?{' '}
                            <Link
                                href="/contact"
                                className="text-[#8B2BB4] font-semibold hover:underline underline-offset-4"
                            >
                                Contact our team →
                            </Link>
                        </p>
                    </FadeIn>
                </div>
            </section>

            {/* ── Section 6: Final CTA Banner ─────────────────────────────────────── */}
            <section
                className="py-20 md:py-28 bg-[#24112D] relative overflow-hidden"
                aria-labelledby="final-cta-heading"
            >
                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-[#8B2BB4]/10 rounded-full blur-[100px]" />
                </div>

                <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
                    <FadeIn>
                        <h2
                            id="final-cta-heading"
                            className="text-3xl md:text-5xl font-heading font-bold text-white mb-5 leading-tight"
                        >
                            Ready to Start Your{' '}
                            <span className="text-[#8B2BB4]">International Career?</span>
                        </h2>
                        <p className="text-slate-300 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                            Join 500+ candidates who have trusted Veda Scholars to unlock global job
                            opportunities. No fees. No risk. Just results.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href={GOOGLE_FORM_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 h-14 px-10 rounded-md bg-[#8B2BB4] text-white font-bold text-lg shadow-xl hover:bg-[#742493] active:scale-95 transition-all duration-300 hover:-translate-y-0.5"
                                aria-label="Submit your job application — opens in a new tab"
                            >
                                Submit Your Application Today
                                <ArrowRight className="w-5 h-5" aria-hidden="true" />
                            </a>
                            <Link
                                href="/services"
                                className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-md border-2 border-white/25 text-white font-semibold text-lg hover:border-[#8B2BB4]/60 hover:text-[#8B2BB4] transition-all duration-300"
                            >
                                Explore Our Services
                            </Link>
                        </div>
                    </FadeIn>
                </div>
            </section>

        </div>
    );
}
