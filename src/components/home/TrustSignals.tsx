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
        <section className="py-16 bg-slate-50 border-b border-slate-100">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200">
                    {metrics.map((metric) => (
                        <div key={metric.id} className="flex flex-col items-center justify-center p-6 group hover:bg-white hover:shadow-sm transition-all duration-300 rounded-lg">
                            <div className="mb-4 p-3 bg-primary/5 rounded-full group-hover:bg-primary/10 transition-colors">
                                {metric.icon}
                            </div>
                            <h3 className="text-4xl font-heading font-bold text-primary mb-2">
                                {metric.value}
                            </h3>
                            <p className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-1">
                                {metric.label}
                            </p>
                            <p className="text-sm text-slate-400 font-light">
                                {metric.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
