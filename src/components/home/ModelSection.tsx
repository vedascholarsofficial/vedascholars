import React from 'react';
import { Compass, GraduationCap, Zap, Briefcase, CheckCircle2 } from 'lucide-react';
import * as motion from "framer-motion/client";
import Reveal from '../animations/Reveal';

const EASE = [0.16, 1, 0.3, 1] as const;

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
        <section className="py-16 md:py-28 bg-white relative overflow-hidden">
            <div className="absolute top-1/4 -right-48 w-[30rem] h-[30rem] rounded-full bg-accent/15 blur-3xl"></div>

            <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center mb-12 md:mb-20 max-w-3xl mx-auto">
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

                {/* 4-Step Flow */}
                <div className="relative mb-16 md:mb-24">
                    {/* Connector: a vertical rail on mobile, a horizontal rail on desktop, drawn as you scroll in */}
                    <motion.div
                        aria-hidden="true"
                        className="md:hidden absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-secondary/50 via-secondary/25 to-transparent origin-top"
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: true, margin: '0px 0px -15% 0px' }}
                        transition={{ duration: 1.4, ease: EASE }}
                    />
                    <motion.div
                        aria-hidden="true"
                        className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-secondary/40 via-secondary/30 to-secondary/40 origin-left"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true, margin: '0px 0px -15% 0px' }}
                        transition={{ duration: 1.6, delay: 0.2, ease: EASE }}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-8 relative z-10">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.id}
                                className="flex md:flex-col items-start md:items-center gap-5 md:gap-0 text-left md:text-center group"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                                transition={{ duration: 0.8, delay: index * 0.15, ease: EASE }}
                            >
                                <div className="relative shrink-0 md:mb-6">
                                    <div className="absolute inset-0 rounded-2xl bg-secondary/40 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="relative w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-secondary to-primary rounded-2xl flex items-center justify-center shadow-lg shadow-secondary/25 ring-4 ring-white group-hover:-translate-y-2 group-hover:rotate-3 transition-transform duration-500">
                                        {step.icon}
                                    </div>
                                    <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[11px] font-bold text-secondary shadow-md ring-1 ring-secondary/20">
                                        {step.id}
                                    </span>
                                </div>
                                <div className="pt-1 md:pt-0">
                                    <h3 className="text-lg md:text-xl font-heading font-bold text-primary mb-1.5 md:mb-2">{step.title}</h3>
                                    <p className="text-slate-600 leading-relaxed text-[15px] md:px-4">
                                        {step.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Stakeholder Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {benefits.map((benefit, index) => (
                        <Reveal key={benefit.role} delay={index * 0.12} className="h-full">
                            <div className="group h-full flex flex-col bg-[#F7F1FA] border border-[#EADCF1] rounded-3xl p-7 md:p-9 hover:bg-white hover:border-secondary/30 hover:shadow-[0_24px_60px_-20px_rgba(139,43,180,0.3)] hover:-translate-y-1 transition-all duration-500">
                                <h3 className="text-2xl font-heading font-bold text-secondary mb-3 md:mb-4">
                                    For {benefit.role}
                                </h3>
                                <p className="text-slate-600 leading-relaxed mb-6 flex-grow">
                                    {benefit.description}
                                </p>
                                <ul className="space-y-3 mt-auto pt-6 border-t border-[#EADCF1]">
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
