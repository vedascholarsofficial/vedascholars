import React from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import Button from '../ui/Button';

export default function Hero() {
    return (
        <section className="relative -mt-20 min-h-[100svh] flex items-center justify-center overflow-hidden">
            {/* Background Image with layered, directional lighting (no flat colour wash) */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 scale-105"
                style={{ backgroundImage: 'url(/images/hero-bg.png)', filter: 'saturate(0.85) contrast(1.05)' }}
            />
            {/* Neutral deep base so the photo keeps its depth */}
            <div className="absolute inset-0 z-0 bg-[#0D0612]/55" />
            {/* Vignette: darker behind the copy, photo stays visible at the edges */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_65%_55%_at_50%_48%,rgba(13,6,18,0.62),transparent_100%)]" />
            <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(13,6,18,0.7)_100%)]" />
            {/* Brand light: a soft plum glow from the top right and a quieter one bottom left */}
            <div className="absolute inset-0 z-0 mix-blend-screen bg-[radial-gradient(ellipse_45%_50%_at_88%_8%,rgba(139,43,180,0.38),transparent_70%),radial-gradient(ellipse_40%_45%_at_8%_95%,rgba(94,29,122,0.32),transparent_70%)]" />
            {/* Top scrim keeps the transparent navigation legible; bottom fade grounds the section */}
            <div className="absolute inset-x-0 top-0 z-0 h-44 bg-gradient-to-b from-[#0D0612]/70 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 z-0 h-48 bg-gradient-to-t from-[#0D0612] to-transparent" />

            {/* Content */}
            <div className="container mx-auto px-4 md:px-6 relative z-10 text-center pt-24 pb-28 sm:pt-28 md:pb-24">
                <div className="relative top-3 md:top-4 max-w-5xl mx-auto space-y-6 sm:space-y-8 md:space-y-10 animate-fade-in-up">
                    <h1
                        style={{ fontFamily: 'var(--font-serif-display), Georgia, serif', fontOpticalSizing: 'auto' }}
                        className="text-[2.375rem] sm:text-[3rem] md:text-[3.75rem] lg:text-[clamp(3.5rem,4.4vw,4.25rem)] font-semibold text-white leading-[1.08] tracking-[-0.015em] text-balance drop-shadow-[0_3px_16px_rgba(0,0,0,0.5)]"
                    >
                        <span className="block">Empowering Your Journey from</span>
                        <span className="block italic font-medium text-[#E6B8F3] mt-1.5 md:mt-3">Education to Employment</span>
                    </h1>

                    <div className="mx-auto h-px w-28 bg-gradient-to-r from-transparent via-[#E0A6EF]/80 to-transparent" />

                    <p className="text-[1.0625rem] sm:text-lg md:text-xl lg:text-[1.25rem] text-white/80 max-w-[21rem] sm:max-w-[34rem] md:max-w-[40rem] lg:max-w-[44rem] mx-auto font-normal leading-[1.7] text-balance drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)]">
                        Bridging the gap between academic aspirations and career success.
                        We guide students, partner with universities, and connect talent with top recruiters.
                    </p>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-2 md:pt-4 w-full max-w-[21rem] sm:max-w-none mx-auto">
                        <Button variant="primary" size="lg" href="/contact?type=student" className="w-full sm:w-auto rounded-full px-10 border border-white/25 shadow-[0_12px_30px_rgba(82,20,108,0.45)]">
                            Book Free Counselling
                            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </Button>
                        <Button variant="outline" size="lg" href="/contact?type=partner" className="w-full sm:w-auto rounded-full px-10 border border-white !bg-white !text-[#24112D] hover:!bg-[#F4E9F8] hover:!text-[#24112D] shadow-[0_12px_30px_rgba(0,0,0,0.28)]">
                            Partner With Us
                        </Button>
                    </div>
                </div>
            </div>

            {/* A functional, touch-friendly cue into the next section. */}
            <a
                href="#impact"
                aria-label="Scroll to see our impact"
                className="absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-2 text-white/75 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E6B8F3] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0D0612] rounded-full"
            >
                <span className="text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.24em] leading-none">Explore</span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 shadow-[0_8px_28px_rgba(0,0,0,0.28)] backdrop-blur-md">
                    <ChevronDown className="h-5 w-5 animate-bounce motion-reduce:animate-none" strokeWidth={1.8} />
                </span>
            </a>
        </section>
    );
}
