import React from 'react';
import { TrendingUp, Award, Users, CheckCircle2 } from 'lucide-react';

export default function EmployabilityOutcomes() {
    const stats = [
        {
            id: 1,
            label: "Placement Rate",
            value: "95%",
            icon: <TrendingUp className="w-6 h-6 text-secondary" />,
            text: "Of our certified scholars secure employment within 3 months of graduation."
        },
        {
            id: 2,
            label: "Retention Rate",
            value: "90%",
            icon: <Users className="w-6 h-6 text-secondary" />,
            text: "Higher retention in university programs due to better fit and preparation."
        },
        {
            id: 3,
            label: "Skill Alignment",
            value: "100%",
            icon: <Award className="w-6 h-6 text-secondary" />,
            text: "Curriculum tailored to meet current industry demands and soft-skill requirements."
        }
    ];

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">
                        The Veda Difference: <span className="text-secondary">Measured Outcomes</span>
                    </h2>
                    <p className="text-slate-600">
                        We move beyond the traditional agent model. Our metrics focus on quality, retention, and long-term career success.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {stats.map((stat) => (
                        <div key={stat.id} className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-center hover:shadow-lg transition-shadow duration-300">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                                {stat.icon}
                            </div>
                            <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                            <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">{stat.label}</div>
                            <p className="text-slate-600 leading-relaxed">
                                {stat.text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
