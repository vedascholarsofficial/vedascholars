import React from 'react';
import Button from '../ui/Button';
import Reveal from '../animations/Reveal';

export default function FinalCTA() {
    return (
        <section className="py-20 md:py-28 bg-primary text-white relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,43,180,0.35),transparent_60%)]"></div>
            <div className="absolute -bottom-1/2 left-1/2 -translate-x-1/2 w-[60rem] h-[30rem] rounded-full bg-secondary/15 blur-3xl animate-float-slow"></div>
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"></div>

            <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8 text-center">
                <Reveal>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-6 tracking-tight text-white max-w-4xl mx-auto text-balance">
                        Ready to bridge the gap from <span className="text-accent">Education to Employment?</span>
                    </h2>
                </Reveal>

                <Reveal delay={0.12}>
                    <p className="text-base sm:text-lg md:text-xl text-white/80 leading-relaxed mb-10 max-w-2xl mx-auto">
                        Get clear, honest guidance on your next step, from choosing a course to preparing for your career.
                    </p>
                </Reveal>

                <Reveal delay={0.24}>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center max-w-[21rem] sm:max-w-none mx-auto">
                        <Button variant="primary" size="lg" href="/contact?type=student" className="rounded-full min-w-[200px] shadow-lg shadow-secondary/20 hover:shadow-[0_18px_44px_rgba(139,43,180,0.55)]">
                            Book Your Free Counselling
                        </Button>
                        <Button variant="outline" size="lg" href="/contact?type=partner" className="rounded-full min-w-[200px] border-white/40 text-white hover:bg-white hover:text-primary hover:border-white">
                            Partner With Us
                        </Button>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
