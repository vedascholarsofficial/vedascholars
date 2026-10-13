import React from 'react';
import { Compass, GraduationCap, Zap, Briefcase, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Reveal from '../animations/Reveal';



export default function ModelSection() {
    const steps = [
        {
            id: 1,
            title: "Career Guidance",
            icon: <Compass className="w-7 h-7 md:w-8 md:h-8 text-white" />,
            description: "Personalized pathfinding based on aptitude and market trends."
        },
        {
            id: 2,
            title: "Education Pathway",
            icon: <GraduationCap className="w-7 h-7 md:w-8 md:h-8 text-white" />,
            description: "Guidance on choosing and applying to universities in India and abroad."
        },
        {
            id: 3,
            title: "Skill Development",
            icon: <Zap className="w-7 h-7 md:w-8 md:h-8 text-white" />,
            description: "Practical skills training to prepare for study and work."
        },
        {
            id: 4,
            title: "Employment",
            icon: <Briefcase className="w-7 h-7 md:w-8 md:h-8 text-white" />,
            description: "Career preparation and introductions to employers, where available."
        }
    ];

    const benefits = [
        {
            role: "Students",
            description: "Gain clarity, education, and employability in one seamless journey.",
            points: ["Career Roadmap", "Application Guidance", "Career Preparation"]
        },
        {
            role: "Universities",
            description: "Connect with well-informed, well-prepared applicants.",
            points: ["Informed Applicants", "Diverse Talent", "Pre-arrival Preparation"]
        },
        {
            role: "Recruiters",
            description: "Meet students and graduates preparing for the world of work.",
            points: ["Focused Shortlists", "Skill-Matched", "Early-career Talent"]
        }
    ];

    return (
        <section className="py-16 md:py-24 bg-[#fbf6ee] border-t border-[#efe4d4] relative overflow-hidden">
            <div className="absolute top-1/4 -right-48 w-[30rem] h-[30rem] rounded-full bg-accent/15 blur-3xl"></div>

            <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="mb-9 md:mb-12 max-w-3xl">
                    <Reveal>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-primary mb-4 md:mb-5 tracking-tight">
                            Our Education to Employment Model
                        </h2>
                    </Reveal>
                    <Reveal delay={0.12}>
                        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                            A comprehensive ecosystem designed to bridge the gap between academic potential and professional success.
                        </p>
                    </Reveal>
                </div>

                <div className="mb-12 grid items-stretch gap-8 lg:mb-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
                    <Reveal className="relative aspect-square overflow-hidden rounded-[2rem] bg-slate-100 lg:aspect-auto lg:min-h-[540px]">
                        <Image src="/images/home/model-v2.webp" alt="University students collaborating on a practical project in a bright learning studio" fill sizes="(min-width: 1024px) 560px, (min-width: 640px) 720px, 100vw" className="object-cover" />
                    </Reveal>
                    <ol className="flex flex-col justify-center divide-y divide-slate-200/80">
                        {steps.map((step, index) => (
                            <li key={step.id} className="py-5 first:pt-0 last:pb-0 md:py-7">
                                <Reveal variant={index % 2 === 0 ? 'left' : 'right'} duration={0.9} delay={index * 0.07} className="flex items-start gap-5 md:gap-6">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-secondary/20 bg-muted/60 font-display text-lg text-secondary">{step.id}</span>
                                    <div>
                                        <h3 className="mb-2 text-xl md:text-2xl">{step.title}</h3>
                                        <p className="max-w-lg text-base leading-relaxed text-slate-600">{step.description}</p>
                                    </div>
                                </Reveal>
                            </li>
                        ))}
                    </ol>
                </div>

                {/* Stakeholder Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {benefits.map((benefit, index) => (
                        <Reveal key={benefit.role} delay={index * 0.12} className="h-full">
                            <div className="group h-full flex flex-col bg-white border border-[#ecdfcc] rounded-3xl p-7 md:p-9 hover:bg-white hover:border-secondary/30 hover:shadow-[0_24px_60px_-20px_rgba(139,43,180,0.3)] hover:-translate-y-1 transition-all duration-500">
                                <h3 className="text-2xl font-heading font-bold text-primary mb-3 md:mb-4">
                                    For {benefit.role}
                                </h3>
                                <p className="text-slate-600 leading-relaxed mb-6 flex-grow">
                                    {benefit.description}
                                </p>
                                <ul className="space-y-3 mt-auto pt-6 border-t border-slate-200/80">
                                    {benefit.points.map((point) => (
                                        <li key={point} className="flex items-center gap-3 text-[15px] font-semibold text-primary">
                                            <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Reveal>
                    ))}
                </div>

            </div>
        </section>
    );
}
