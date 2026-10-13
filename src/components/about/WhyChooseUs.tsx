import React from 'react';
import { CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Reveal, { ZoomImage } from '@/components/animations/Reveal';

export default function WhyChooseUs() {
    const points = [
        "Proven track record of placements in Top 100 Universities.",
        "End-to-end support from career discovery to visa processing.",
        "Exclusive partnerships with global recruiters.",
        "Scholarship guidance to maximize financial aid.",
        "Post-arrival support for accommodation and networking.",
        "A dedicated mentor assigned to every student."
    ];

    return (
        <section className="py-16 md:py-28 bg-slate-50 relative overflow-hidden">
            <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-secondary/10 blur-3xl"></div>

            <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
                <Reveal>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-primary mb-8 md:mb-12 tracking-tight">
                        Why Choose Veda Scholars?
                    </h2>
                </Reveal>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">

                    {/* Points */}
                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                        {points.map((point, index) => (
                            <Reveal key={index} delay={index * 0.07} className="h-full">
                                <div className="group h-full flex items-start sm:flex-col gap-4 p-5 md:p-6 bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_2px_rgba(36,17,45,0.04)] hover:border-secondary/30 hover:shadow-[0_18px_40px_-18px_rgba(139,43,180,0.3)] hover:-translate-y-0.5 transition-all duration-300">
                                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0 group-hover:bg-secondary group-hover:text-white transition-colors duration-300">
                                        <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                    <span className="text-slate-700 font-medium leading-relaxed">{point}</span>
                                </div>
                            </Reveal>
                        ))}
                    </div>

                    {/* Image Context */}
                    <Reveal variant="right" delay={0.15} className="lg:col-span-5 flex flex-col">
                        <figure className="flex flex-col h-full">
                            <div className="relative w-full aspect-[4/3] lg:aspect-auto lg:flex-1 lg:min-h-[400px] rounded-3xl overflow-hidden shadow-[0_30px_80px_-30px_rgba(36,17,45,0.45)] ring-1 ring-slate-200">
                                <ZoomImage className="absolute inset-0">
                                    <Image
                                        src="/images/about/team.png"
                                        alt="Veda Scholars Team Counselling Session"
                                        fill
                                        sizes="(min-width: 1024px) 40vw, 100vw"
                                        className="object-cover"
                                    />
                                </ZoomImage>
                            </div>
                            <figcaption className="text-sm text-slate-500 mt-4 italic text-center lg:text-left">
                                Our team collaborating to shape your future.
                            </figcaption>
                        </figure>
                    </Reveal>

                </div>
            </div>
        </section>
    );
}
