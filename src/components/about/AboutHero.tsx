import React from 'react';

export default function AboutHero() {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6 text-center">
                <h1 className="text-4xl md:text-6xl font-heading font-bold text-primary mb-6">
                    Who We Are
                </h1>
                <div className="w-24 h-1 bg-secondary mx-auto mb-8 rounded-full"></div>
                <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                    Veda Scholars is a premier education consultancy dedicated to bridging the gap between academic aspirations and professional success. We are not just agents; we are career architects.
                </p>
            </div>
        </section>
    );
}
