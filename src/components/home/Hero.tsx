'use client';

import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import Button from '../ui/Button';
import { useIntroActive } from '../animations/IntroLoader';

const EASE = [0.16, 1, 0.3, 1] as const;
const LINE_ONE = 'Empowering Your Journey from'.split(' ');

export default function Hero() {
    const ref = useRef<HTMLElement>(null);
    const reduce = useReducedMotion();
    const introActive = useIntroActive();
    // Hold the entrance until the intro curtain starts to lift.
    const base = reduce ? 0 : introActive ? 1.0 : 0.15;

    // Parallax: the photo drifts slower than the page and the copy eases away as you scroll past.
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
    const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
    const contentY = useTransform(scrollYProgress, [0, 1], [0, 140]);
    const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

    const rise = (delay: number, y = 24) => ({
        initial: { opacity: 0, y },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.9, delay: base + delay, ease: EASE },
    });

    return (
        <section ref={ref} className="relative -mt-20 min-h-[100svh] flex items-center justify-center overflow-hidden bg-[#0D0612]">
            {/* Background Image with layered, directional lighting (no flat colour wash) */}
            <motion.div className="absolute inset-0 z-0" style={reduce ? undefined : { y: bgY }}>
                <motion.div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: 'url(/images/hero-bg.png)', filter: 'saturate(0.95) contrast(1.02)' }}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1.05 }}
                    transition={{ duration: 2.6, delay: base - 0.4, ease: EASE }}
                />
            </motion.div>
            {/* Neutral deep base so the photo keeps its depth */}
            <div className="absolute inset-0 z-0 bg-[#0D0612]/40" />
            {/* Vignette: darker behind the copy, photo stays visible at the edges */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_65%_55%_at_50%_48%,rgba(13,6,18,0.55),transparent_100%)]" />
            <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(13,6,18,0.7)_100%)]" />
            {/* Brand light: slowly drifting plum glows */}
            <div className="absolute -top-1/3 -right-1/4 z-0 h-[50vmax] w-[50vmax] rounded-full bg-[radial-gradient(circle,rgba(139,43,180,0.14),transparent_60%)] mix-blend-screen animate-float-slow" />
            <div className="absolute -bottom-1/3 -left-1/4 z-0 h-[45vmax] w-[45vmax] rounded-full bg-[radial-gradient(circle,rgba(94,29,122,0.1),transparent_60%)] mix-blend-screen animate-float-slow [animation-delay:-8s]" />
            {/* Top scrim keeps the transparent navigation legible; bottom fade grounds the section */}
            <div className="absolute inset-x-0 top-0 z-0 h-44 bg-gradient-to-b from-[#0D0612]/70 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 z-0 h-48 bg-gradient-to-t from-[#0D0612] to-transparent" />

            {/* Content */}
            <motion.div
                className="container mx-auto px-5 md:px-6 relative z-10 text-center pt-24 pb-28 sm:pt-28 md:pb-24"
                style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
            >
                <div className="relative top-3 md:top-4 max-w-5xl mx-auto space-y-6 sm:space-y-8 md:space-y-10">
                    <h1
                        style={{ fontFamily: 'var(--font-serif-display), Georgia, serif', fontOpticalSizing: 'auto' }}
                        className="text-[2.375rem] sm:text-[3rem] md:text-[3.75rem] lg:text-[clamp(3.5rem,4.4vw,4.25rem)] font-semibold text-white leading-[1.08] tracking-[-0.015em] text-balance drop-shadow-[0_3px_16px_rgba(0,0,0,0.5)]"
                    >
                        <span className="block">
                            {LINE_ONE.map((word, i) => (
                                <React.Fragment key={word}>
                                    <span className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom">
                                        <motion.span
                                            className="inline-block"
                                            initial={{ y: '110%' }}
                                            animate={{ y: 0 }}
                                            transition={{ duration: 1, delay: base + i * 0.07, ease: EASE }}
                                        >
                                            {word}
                                        </motion.span>
                                    </span>
                                    {i < LINE_ONE.length - 1 && ' '}
                                </React.Fragment>
                            ))}
                        </span>
                        <span className="block overflow-hidden pb-[0.14em] -mb-[0.14em] mt-1.5 md:mt-3">
                            <motion.span
                                className="block italic font-medium text-[#E6B8F3]"
                                initial={{ y: '110%', opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 1.1, delay: base + 0.35, ease: EASE }}
                            >
                                Education to Employment
                            </motion.span>
                        </span>
                    </h1>

                    <motion.div
                        className="mx-auto h-px w-28 bg-gradient-to-r from-transparent via-[#E0A6EF]/80 to-transparent"
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        transition={{ duration: 1.1, delay: base + 0.6, ease: EASE }}
                    />

                    <motion.p
                        {...rise(0.7)}
                        className="text-[1.0625rem] sm:text-lg md:text-xl lg:text-[1.25rem] text-white/80 max-w-[21rem] sm:max-w-[34rem] md:max-w-[40rem] lg:max-w-[44rem] mx-auto font-normal leading-[1.7] text-balance drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)]"
                    >
                        Bridging the gap between academic aspirations and career success.
                        We guide students, partner with universities, and connect talent with top recruiters.
                    </motion.p>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-2 md:pt-4 w-full max-w-[21rem] sm:max-w-none mx-auto">
                        <motion.div {...rise(0.85)} className="w-full sm:w-auto">
                            <Button variant="primary" size="lg" href="/contact?type=student" className="relative overflow-hidden w-full sm:w-auto rounded-full px-10 border border-white/25 shadow-[0_12px_30px_rgba(82,20,108,0.45)] hover:shadow-[0_18px_44px_rgba(139,43,180,0.55)]">
                                {/* Sheen sweep on hover */}
                                <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-120%] group-hover:translate-x-[520%] transition-transform duration-1000 ease-out" />
                                <span className="relative inline-flex items-center">
                                    Book Free Counselling
                                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                                </span>
                            </Button>
                        </motion.div>
                        <motion.div {...rise(0.95)} className="w-full sm:w-auto">
                            <Button variant="outline" size="lg" href="/contact?type=partner" className="w-full sm:w-auto rounded-full px-10 border border-white !bg-white !text-[#24112D] hover:!bg-[#F4E9F8] hover:!text-[#24112D] shadow-[0_12px_30px_rgba(0,0,0,0.28)]">
                                Partner With Us
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* A functional, touch-friendly cue into the next section. */}
            <motion.a
                href="#impact"
                aria-label="Scroll to see our impact"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: base + 1.3 }}
                className="absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-2 text-white/75 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E6B8F3] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0D0612] rounded-full"
            >
                <span className="text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.24em] leading-none">Explore</span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 shadow-[0_8px_28px_rgba(0,0,0,0.28)] backdrop-blur-md">
                    <ChevronDown className="h-5 w-5 animate-bounce motion-reduce:animate-none" strokeWidth={1.8} />
                </span>
            </motion.a>
        </section>
    );
}
