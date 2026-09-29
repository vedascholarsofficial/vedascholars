import React from 'react';

export default function ServicesHero() {
    return (
        <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
            {/* Abstract Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
                <p className="text-secondary font-medium tracking-widest uppercase mb-4">Our Methodology</p>
                <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 text-white">
                    The <span className="text-secondary">Education to Employment</span> Philosophy
                </h1>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                    We don't just offer services; we offer a vertically integrated pathway. From choosing the right university to landing your first job, every step is interconnected and strategic.
                </p>
            </div>
        </section>
    );
}
