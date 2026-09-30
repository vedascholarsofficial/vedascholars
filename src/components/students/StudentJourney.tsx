import React from 'react';
import FadeIn from '@/components/animations/FadeIn';
import { MessageCircle, UserCheck, List, FileCheck, Plane, Briefcase } from 'lucide-react';

export default function StudentJourney() {
    const steps = [
        {
            icon: MessageCircle,
            title: "Free Counselling",
            desc: "Initial discussion to understand your aspirations."
        },
        {
            icon: UserCheck,
            title: "Profile Evaluation",
            desc: "Assessing your academic and professional background."
        },
        {
            icon: List,
            title: "University Shortlisting",
            desc: "Selecting the best-fit institutions for you."
        },
        {
            icon: FileCheck,
            title: "Application & Docs",
            desc: "Managing SOPs, LORs, and application forms."
        },
        {
            icon: Plane,
            title: "Visa Processing",
            desc: "Guidance on financial proof and visa interviews."
        },
        {
            icon: Briefcase,
            title: "Pre-Departure",
            desc: "Briefing on life abroad and accommodation support."
        }
    ];

    return (
        <section className="py-20 bg-primary text-white overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <FadeIn>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-white">
                            Your Journey with <span className="text-accent">Veda Scholars</span>
                        </h2>
                        <p className="text-white/80 max-w-2xl mx-auto">
                            A structured, transparent process to take you from confusion to your dream university.
                        </p>
                    </FadeIn>
                </div>

                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden lg:block absolute top-[2.5rem] left-0 right-0 h-0.5 bg-white/15 w-[90%] mx-auto z-0"></div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-4 relative z-10">
                        {steps.map((step, index) => (
                            <FadeIn key={index} delay={index * 0.1}>
                                <div className="flex flex-col items-center text-center group">
                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-white/15 flex items-center justify-center text-accent mb-4 md:mb-6 group-hover:border-[#8B2BB4] group-hover:bg-[#8B2BB4]/10 transition-all duration-300 shadow-lg shadow-black/20 relative bg-[#32163E] z-10">
                                        <step.icon size={28} className="md:w-8 md:h-8" />
                                        <div className="absolute -top-2 -right-2 w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#8B2BB4] text-white text-xs md:text-sm font-bold flex items-center justify-center border-4 border-primary">
                                            {index + 1}
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                                    <p className="text-sm text-white/70 leading-snug px-2">
                                        {step.desc}
                                    </p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
