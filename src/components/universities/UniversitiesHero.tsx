import React from 'react';
import Image from 'next/image';
import Button from '../ui/Button';

export default function UniversitiesHero() {
    return (
        <section className="relative h-[500px] flex items-center">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/universities/corporate.png"
                    alt="Corporate Partnership"
                    fill
                    className="object-cover brightness-50"
                    priority
                />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10 text-white">
                <div className="max-w-3xl">
                    <p className="text-secondary font-medium tracking-widest uppercase mb-4">For Universities & Recruiters</p>
                    <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 leading-tight text-white">
                        Partnering with <br /> <span className="text-[#B8860B]">Universities Worldwide</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-200 mb-8 leading-relaxed max-w-2xl">
                        We don't just send applications; we provide vetted, trained, and career-focused talent that enhances your institution's reputation and your company's bottom line.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button variant="primary" size="lg" href="/contact?type=partner" className="shadow-lg shadow-gold/20">
                            Partner With Us
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
