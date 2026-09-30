import React from 'react';
import { Compass, Globe, Users } from 'lucide-react';

export default function TrustSignals() {
    const metrics = [
        {
            id: 1,
            label: "GUIDED SUPPORT",
            value: "24/7",
            icon: <Compass className="w-8 h-8 text-secondary" />,
            description: "Continuous mentoring throughout the student journey"
        },
        {
            id: 2,
            label: "Countries Served",
            value: "20+",
            icon: <Globe className="w-8 h-8 text-secondary" />,
            description: "Global education network"
        },
        {
            id: 3,
            label: "Students Guided",
            value: "5,000+",
            icon: <Users className="w-8 h-8 text-secondary" />,
            description: "From enrollment to employment"
        }
    ];

    return (
        <section id="impact" className="scroll-mt-0 py-16 md:py-20 bg-gradient-to-b from-[#F7F1FA] to-white border-b border-slate-100">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    {metrics.map((metric) => (
                        <div key={metric.id} className="flex flex-col items-center justify-center p-8 group bg-white border border-[#EADCF1] shadow-[0_8px_30px_rgba(36,17,45,0.05)] hover:shadow-[0_16px_40px_rgba(139,43,180,0.12)] hover:-translate-y-1 transition-all duration-300 rounded-2xl">
                            <div className="mb-5 p-3.5 bg-secondary/10 rounded-2xl group-hover:bg-secondary/15 transition-colors">
                                {metric.icon}
                            </div>
                            <h3 className="text-4xl md:text-5xl font-heading font-extrabold text-primary mb-3">
                                {metric.value}
                            </h3>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary mb-2">
                                {metric.label}
                            </p>
                            <p className="text-[15px] text-slate-600 leading-relaxed">
                                {metric.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
