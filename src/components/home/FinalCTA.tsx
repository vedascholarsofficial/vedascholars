import React from 'react';
import Button from '../ui/Button';

export default function FinalCTA() {
    return (
        <section className="py-24 md:py-28 bg-primary text-white relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,43,180,0.35),transparent_60%)]"></div>

            <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
                <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6 tracking-tight text-white max-w-4xl mx-auto">
                    Ready to bridge the gap from <span className="text-accent">Education to Employment?</span>
                </h2>

                <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-10 max-w-2xl mx-auto">
                    Join thousands of students and professionals building successful global careers with Veda Scholars.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button variant="primary" size="lg" href="/contact?type=student" className="min-w-[200px] shadow-lg shadow-secondary/20">
                        Book Your Free Counselling
                    </Button>
                    <Button variant="outline" size="lg" href="/contact?type=partner" className="min-w-[200px] border-white/40 text-white hover:bg-white hover:text-primary hover:border-white">
                        Partner With Us
                    </Button>
                </div>
            </div>
        </section>
    );
}
