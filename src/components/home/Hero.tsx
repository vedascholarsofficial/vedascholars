import React from 'react';
import Button from '../ui/Button';

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
                style={{ backgroundImage: 'url(/images/hero-bg.png)' }}
            >
                <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90" />
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 md:px-6 relative z-10 text-center pt-20 pb-24">
                <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-heading font-bold text-white leading-tight">
                        Empowering Your Journey from <br />
                        <span className="text-secondary">Education to Employment</span>
                    </h1>

                    <p className="text-lg md:text-xl lg:text-2xl text-slate-200 max-w-2xl mx-auto font-light leading-relaxed">
                        Bridging the gap between academic aspirations and career success.
                        We guide students, partner with universities, and connect talent with top recruiters.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Button variant="primary" size="lg" href="/contact?type=student" className="w-full sm:w-auto shadow-xl shadow-secondary/20">
                            Book Free Counselling
                        </Button>
                        <Button variant="secondary" size="lg" href="/contact?type=partner" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-slate-900 hover:border-white">
                            Partner With Us
                        </Button>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator - Reverted to Clean Arrow & Fixed Position */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20 hidden md:block">
                <svg className="w-8 h-8 text-white/70 mx-auto drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </section>
    );
}
