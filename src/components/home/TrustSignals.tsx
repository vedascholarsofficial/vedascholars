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
        <section id="impact" className="scroll-mt-0 py-16 md:py-24 bg-gradient-to-b from-[#F7F1FA] to-white border-b border-slate-100 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(rgba(36,17,45,0.06)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]"></div>

            <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-center">
                    {metrics.map((metric, index) => (
                        <Reveal key={metric.id} delay={index * 0.12} className="h-full">
                            <div className="group relative h-full overflow-hidden flex flex-col items-center p-7 md:p-9 bg-white border border-[#EADCF1] shadow-[0_8px_30px_rgba(36,17,45,0.05)] hover:shadow-[0_24px_60px_-20px_rgba(139,43,180,0.3)] hover:-translate-y-1.5 hover:border-secondary/30 transition-all duration-500 rounded-3xl">
                                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-secondary via-accent to-primary origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
                                <div className="mb-5 p-3.5 bg-secondary/10 text-secondary rounded-2xl group-hover:bg-secondary group-hover:text-white group-hover:rotate-6 transition-all duration-500">
                                    {metric.icon}
                                </div>
                                <h3 className="text-4xl md:text-5xl font-heading font-extrabold text-primary mb-3 tracking-tight">
                                    {metric.value}
                                </h3>
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary mb-2">
                                    {metric.label}
                                </p>
                                <p className="text-[15px] text-slate-600 leading-relaxed">
                                    {metric.description}
                                </p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
