import React from 'react';

export default function ContactHero() {
    return (
        <section className="bg-primary text-white py-20 relative overflow-hidden">
            {/* Abstract Background Element */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>

            <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
                <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 text-white">
                    Let's Start Your <span className="text-secondary">Journey</span>
                </h1>
                <p className="text-xl text-slate-200 max-w-2xl mx-auto mb-4">
                    Ready to take the first step towards your global career? We are here to guide you.
                </p>
                <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-sm font-medium text-slate-200">Calls responded to within 24 hours</span>
                </div>
            </div>
        </section>
    );
}
