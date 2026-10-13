import React from 'react';
import { Shield, Star, Heart, FileText } from 'lucide-react';
import Reveal from '@/components/animations/Reveal';

export default function CoreValues() {
    const values = [
        {
            id: 1,
            name: "Integrity",
            description: "We adhere to the highest ethical standards. No hidden costs, no false promises.",
            icon: <Shield className="w-7 h-7" />
        },
        {
            id: 2,
            name: "Excellence",
            description: "We strive for perfection in every application, every essay, and every counseling session.",
            icon: <Star className="w-7 h-7" />
        },
        {
            id: 3,
            name: "Empathy",
            description: "We understand the anxiety of career planning. We listen, we care, and we guide.",
            icon: <Heart className="w-7 h-7" />
        },
        {
            id: 4,
            name: "Transparency",
            description: "Clear processes and honest feedback. You will always know where you stand.",
            icon: <FileText className="w-7 h-7" />
        }
    ];

    return (
        <section className="py-16 md:py-28 bg-[#24112D] text-white relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute -bottom-40 -left-40 w-[32rem] h-[32rem] rounded-full bg-secondary/25 blur-3xl"></div>
            <div className="absolute -top-40 -right-40 w-[26rem] h-[26rem] rounded-full bg-accent/10 blur-3xl"></div>
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"></div>

            <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-16 items-end mb-10 md:mb-16">
                    <Reveal className="lg:col-span-5">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white tracking-tight">Our Core Values</h2>
                    </Reveal>
                    <Reveal delay={0.15} className="lg:col-span-7">
                        <p className="text-slate-200 text-base sm:text-lg md:text-xl leading-relaxed lg:border-l lg:border-white/15 lg:pl-14">
                            The principles that guide every decision we make and every student we help.
                        </p>
                    </Reveal>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {values.map((v, index) => (
                        <Reveal key={v.id} delay={index * 0.1} className="h-full">
                            <div className="group relative h-full overflow-hidden rounded-3xl p-6 md:p-8 bg-white/[0.04] border border-white/10 backdrop-blur-sm hover:bg-white/[0.07] hover:border-[#8B2BB4]/70 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_-20px_rgba(139,43,180,0.6)] transition-all duration-500">
                                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="flex items-center gap-4 sm:block">
                                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-white/10 text-white flex items-center justify-center sm:mb-6 group-hover:bg-[#8B2BB4] group-hover:scale-110 transition-all duration-500">
                                        {v.icon}
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-heading font-bold text-white sm:mb-3">{v.name}</h3>
                                </div>
                                <p className="text-slate-200 leading-relaxed mt-4 sm:mt-0">
                                    {v.description}
                                </p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
