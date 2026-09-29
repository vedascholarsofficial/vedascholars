import React from 'react';
import { CheckCircle } from 'lucide-react';
import Image from 'next/image';

export default function WhyChooseUs() {
    const points = [
        "Proven track record of placements in Top 100 Universities.",
        "End-to-end support from career discovery to visa processing.",
        "Exclusive partnerships with global recruiters.",
        "Scholarship guidance to maximize financial aid.",
        "Post-arrival support for accommodation and networking.",
        "A dedicated mentor assigned to every student."
    ];

    return (
        <section className="py-16 md:py-20 bg-slate-50 relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="flex flex-col md:flex-row gap-16 items-center">

                    {/* Content */}
                    <div className="w-full md:w-1/2">
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-8">
                            Why Choose Veda Scholars?
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            {points.map((point, index) => (
                                <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                                    <CheckCircle className="w-6 h-6 text-secondary shrink-0 mt-0.5" />
                                    <span className="text-slate-700 font-medium">{point}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Image Context */}
                    <div className="w-full md:w-1/2">
                        <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                            <Image
                                src="/images/about/team.png"
                                alt="Veda Scholars Team Counselling Session"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <p className="text-center text-sm text-slate-500 mt-4 italic">
                            Our team collaborating to shape your future.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}
