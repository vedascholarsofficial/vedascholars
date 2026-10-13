import React from 'react';
import { Target, Compass } from 'lucide-react';
import Reveal from '@/components/animations/Reveal';

export default function VisionMission() {
    const items = [
        {
            title: "Our Vision",
            text: "To be a trusted partner for students and families across the whole education journey, helping every student make informed choices and reach their potential.",
            icon: <Target className="w-6 h-6 md:w-7 md:h-7" />,
        },
        {
            title: "Our Mission",
            text: "We empower students by providing ethical, transparent, and personalized guidance. We commit to supporting them not just in admission, but throughout their journey to a meaningful career.",
            icon: <Compass className="w-6 h-6 md:w-7 md:h-7" />,
        },
    ];

    return (
        <section className="py-14 md:py-20 bg-white">
            <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-8">
                    {items.map((item, index) => (
                        <Reveal key={item.title} delay={index * 0.12} className="h-full">
                            <div className="group relative h-full overflow-hidden bg-[#faf9fc] p-7 sm:p-9 lg:p-12 rounded-3xl border border-slate-200/80 shadow-[0_1px_2px_rgba(36,17,45,0.04)] hover:shadow-[0_14px_40px_-24px_rgba(36,17,45,0.18)] hover:-translate-y-1 transition-all duration-500">
                                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-secondary/40 via-slate-200 to-transparent origin-left scale-x-[0.3] group-hover:scale-x-100 transition-transform duration-700"></div>

                                <div className="relative">
                                    <div className="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-6 md:mb-8 group-hover:bg-secondary group-hover:text-white  transition-all duration-500">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-3 md:mb-4 tracking-tight">{item.title}</h3>
                                    <p className="text-slate-600 leading-relaxed text-base md:text-lg">
                                        {item.text}
                                    </p>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
