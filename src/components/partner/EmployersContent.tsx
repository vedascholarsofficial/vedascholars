import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, Rocket, Handshake, Target, Clock, Globe } from 'lucide-react';
import Link from 'next/link';
import FadeIn from '@/components/animations/FadeIn';

export default function EmployersContent() {
    const offerings = [
        {
            icon: Users,
            title: "Skilled Graduate Talent",
            desc: "Access a diverse pool of pre-vetted graduates ready to contribute immediately."
        },
        {
            icon: Rocket,
            title: "Campus-to-Corporate Hiring",
            desc: "Streamlined recruitment drives and placement support to simplify your hiring."
        },
        {
            icon: Handshake,
            title: "Internship Programs",
            desc: "Engage with students early through structured internship opportunities."
        },
        {
            icon: Target,
            title: "Workforce Readiness",
            desc: "Collaborate on training to ensure students have the specific skills you need."
        }
    ];

    const advantages = [
        {
            icon: Clock,
            title: "Reduced Hiring Time",
            desc: "We filter candidates to match your specific requirements, saving you valuable time."
        },
        {
            icon: Globe,
            title: "Global Talent Access",
            desc: "Tap into a network of international students with diverse perspectives."
        },
        {
            icon: Building2,
            title: "Long-term Partnership",
            desc: "Build a sustainable talent pipeline for your organization's future growth."
        }
    ];

    return (
        <div>
            {/* Hero Section for Employers */}
            {/* Hero Section removed - handled by PartnerHero */}


            {/* What We Offer */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">
                            What We Offer <span className="text-[#B8860B]">Employers</span>
                        </h2>
                        <p className="text-slate-300 max-w-2xl mx-auto">
                            Tailored recruitment and training solutions to meet your workforce needs.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {offerings.map((offer, index) => (
                            <FadeIn key={index} delay={index * 0.1}>
                                <div className="bg-slate-50 p-8 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 h-full group">
                                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 text-[#B8860B]">
                                        <offer.icon size={28} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3 text-center">{offer.title}</h3>
                                    <p className="text-slate-300 leading-relaxed text-center text-sm">{offer.desc}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Veda Scholars */}
            <section className="py-20 bg-slate-50 border-t border-slate-200">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">
                            Why Employers Choose <span className="text-[#B8860B]">Us</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {advantages.map((adv, index) => (
                            <FadeIn key={index} delay={index * 0.2}>
                                <div className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-100">
                                    <div className="mb-6 p-4 bg-[#B8860B]/10 rounded-full text-[#B8860B]">
                                        <adv.icon size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{adv.title}</h3>
                                    <p className="text-slate-300">{adv.desc}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <div className="p-8 bg-slate-900 rounded-2xl max-w-4xl mx-auto text-white relative overflow-hidden">
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="text-left">
                                    <h3 className="text-2xl font-bold font-heading mb-2 text-white">Ready to build your team?</h3>
                                    <p className="text-white font-medium">Start hiring exceptional talent today.</p>
                                </div>
                                <Link
                                    href="/contact?type=employer"
                                    className="bg-[#B8860B] hover:bg-[#9a7009] text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-colors whitespace-nowrap"
                                >
                                    Get In Touch
                                </Link>
                            </div>
                            {/* Decor */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#B8860B]/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
