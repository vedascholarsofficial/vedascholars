import React from 'react';
import { Quote } from 'lucide-react';

export default function Testimonials() {
    const testimonials = [
        {
            id: 1,
            name: "Priya Sharma",
            role: "Masters in Biotechnology",
            institution: "Cambridge University",
            quote: "Veda Scholars didn't just help me with my application; they helped me shape my career vision. The guidance was personalized and deeply insightful.",
        },
        {
            id: 2,
            name: "Arjun Mehta",
            role: "Placed at Deloitte",
            institution: "Ex-Imperial College London",
            quote: "The transition from university to a top-tier corporate role was seamless thanks to their career mentorship program. I felt ready from day one.",
        },
        {
            id: 3,
            name: "Sarah Williams",
            role: "MBA Candidate",
            institution: "INSEAD",
            quote: "Honest, transparent, and incredibly supportive. They understood my goals better than I did and pushed me to aim higher. Highly recommended.",
        }
    ];

    return (
        <section className="py-24 bg-gradient-to-b from-white to-[#F7F1FA]">
            <div className="container mx-auto px-4 md:px-6">

                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">
                        Hear from our Students
                    </h2>
                    <div className="w-24 h-1 bg-secondary mx-auto rounded-full"></div>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t) => (
                        <div key={t.id} className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgba(36,17,45,0.06)] hover:shadow-[0_16px_40px_rgba(139,43,180,0.12)] hover:-translate-y-1 transition-all duration-300 border border-[#EADCF1] border-t-4 border-t-secondary relative">
                            <div className="absolute top-8 right-8 text-secondary/15">
                                <Quote className="w-10 h-10" />
                            </div>

                            <div className="relative z-10 h-full flex flex-col">
                                <p className="text-slate-700 mb-8 leading-relaxed italic pr-8">
                                    "{t.quote}"
                                </p>

                                <div className="mt-auto">
                                    <h4 className="font-heading font-bold text-lg text-primary">
                                        {t.name}
                                    </h4>
                                    <p className="text-sm font-semibold text-secondary mb-0.5">
                                        {t.institution}
                                    </p>
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                                        {t.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}