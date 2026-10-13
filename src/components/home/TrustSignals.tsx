import React from 'react';
import { Compass, Globe, Users } from 'lucide-react';
import Reveal from '../animations/Reveal';

export default function TrustSignals() {
    const metrics = [
        {
            id: 1,
            label: "First Consultation",
            value: "Free",
            icon: <Users className="w-7 h-7 md:w-8 md:h-8" />,
            description: "Your first counselling session is free, with no obligation."
        },
        {
            id: 2,
            label: "Transparent Advice",
            value: "Honest",
            icon: <Compass className="w-7 h-7 md:w-8 md:h-8" />,
            description: "Clear guidance on options, costs and risks. We never promise admissions, visas or jobs."
        },
        {
            id: 3,
            label: "Whole-Journey Support",
            value: "End-to-end",
            icon: <Globe className="w-7 h-7 md:w-8 md:h-8" />,
            description: "From career discovery to university applications and preparing for student life."
        }
    ];

    return (
        <section id="impact" className="scroll-mt-20 border-b border-slate-100 bg-gradient-to-b from-[#f7f1fa] to-white py-12 md:py-16">
            <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
                <div className="grid gap-4 md:grid-cols-3 md:gap-6">
                    {metrics.map((metric, index) => (
                        <Reveal key={metric.id} delay={index * 0.08} className="h-full">
                            <div className="flex h-full flex-col items-center rounded-3xl border border-[#eadcf1] bg-white px-6 py-7 text-center shadow-[0_8px_30px_-16px_rgba(36,17,45,0.16)] transition-shadow duration-300 hover:shadow-[0_16px_40px_-20px_rgba(139,43,180,0.25)] md:px-8 md:py-9">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-secondary [&>svg]:h-6 [&>svg]:w-6" aria-hidden="true">
                                    {metric.icon}
                                </div>
                                <h3 className="mb-3 text-3xl font-heading font-bold tracking-tight md:text-4xl">{metric.value}</h3>
                                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-secondary">{metric.label}</p>
                                <p className="max-w-sm text-sm leading-relaxed text-slate-600">{metric.description}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
