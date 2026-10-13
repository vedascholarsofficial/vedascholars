import React from 'react';
import Reveal from '@/components/animations/Reveal';

export default function AboutHero() {
    return (
        <section className="relative overflow-hidden bg-white pt-14 pb-16 md:pt-24 md:pb-24">
            {/* Background Decor */}
            <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] md:w-[40rem] md:h-[40rem] rounded-full bg-secondary/10 blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-[24rem] h-[24rem] rounded-full bg-accent/20 blur-3xl"></div>
            <div className="absolute inset-0 bg-[radial-gradient(rgba(36,17,45,0.07)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"></div>

            <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
                    <div className="lg:col-span-5">
                        <Reveal>
                            <h1 className="text-[2.75rem] leading-[1.05] sm:text-6xl lg:text-7xl font-heading font-bold text-primary tracking-tight">
                                Who We Are
                            </h1>
                        </Reveal>
                        <Reveal variant="line" delay={0.3} duration={1} className="w-24 h-1 bg-gradient-to-r from-secondary to-accent mt-6 md:mt-8 rounded-full" />
                    </div>

                    <Reveal delay={0.15} className="lg:col-span-7">
                        <div className="relative pl-6 md:pl-10 lg:pl-14">
                            <span className="absolute left-0 top-1 bottom-1 w-px bg-gradient-to-b from-secondary via-secondary/30 to-transparent"></span>
                            <p className="text-lg sm:text-xl md:text-2xl text-slate-600 leading-relaxed text-pretty">
                                Veda Scholars is a premier education consultancy dedicated to bridging the gap between academic aspirations and professional success. We are not just agents; we are career architects.
                            </p>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
