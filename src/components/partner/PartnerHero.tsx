'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Button from '../ui/Button';
import FadeIn from '../animations/FadeIn';

interface PartnerHeroProps {
    activeTab: 'universities' | 'employers';
    setActiveTab: (tab: 'universities' | 'employers') => void;
}

export default function PartnerHero({ activeTab, setActiveTab }: PartnerHeroProps) {
    const [bgImage, setBgImage] = useState('');

    useEffect(() => {
        // Preload images or set based on tab
        if (activeTab === 'universities') {
            setBgImage('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80'); // Academic
        } else {
            setBgImage('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80'); // Corporate
        }
    }, [activeTab]);

    return (
        <section className="relative h-[650px] flex items-center justify-center overflow-hidden">
            {/* Dynamic Background Image */}
            <div className="absolute inset-0 z-0">
                <div key={activeTab} className="absolute inset-0 animate-fade-in">
                    {/* Using key to trigger re-render and animation on tab change */}
                    <div className="absolute inset-0 bg-slate-900/60 z-10" /> {/* Overlay */}
                    <Image
                        src={activeTab === 'universities'
                            ? 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80'
                            : 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80'
                        }
                        alt={activeTab === 'universities' ? "University Campus" : "Corporate Office"}
                        fill
                        className="object-cover transition-transform duration-1000 scale-105"
                        priority
                    />
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-20 text-center text-white pt-20">
                <FadeIn>
                    <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 leading-tight drop-shadow-lg text-white">
                        Partnering with <br />
                        <span className="text-[#B8860B]">
                            {activeTab === 'universities' ? 'Global Universities' : 'Industry Leaders'}
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-100 mb-10 leading-relaxed max-w-3xl mx-auto drop-shadow-md">
                        {activeTab === 'universities'
                            ? "We don't just send applications; we provide vetted, trained, and career-focused talent that enhances your institution's global reputation."
                            : "Access a pipeline of pre-screened, ambitious graduates ready to drive innovation and growth in your organization."
                        }
                    </p>

                    {/* Integrated Toggle - Glassmorphism */}
                    <div className="inline-flex p-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-xl mb-10">
                        <button
                            onClick={() => setActiveTab('universities')}
                            className={`px-8 py-3 rounded-full text-base font-semibold transition-all duration-300 ${activeTab === 'universities'
                                ? 'bg-[#B8860B] text-white shadow-lg'
                                : 'text-slate-200 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            Universities
                        </button>
                        <button
                            onClick={() => setActiveTab('employers')}
                            className={`px-8 py-3 rounded-full text-base font-semibold transition-all duration-300 ${activeTab === 'employers'
                                ? 'bg-[#B8860B] text-white shadow-lg'
                                : 'text-slate-200 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            Employers
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button variant="primary" size="lg" href={`/contact?type=${activeTab === 'universities' ? 'partner' : 'employer'}`} className="shadow-lg shadow-gold/20 min-w-[200px]">
                            {activeTab === 'universities' ? 'Partner With Us' : 'Hire Talent'}
                        </Button>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
