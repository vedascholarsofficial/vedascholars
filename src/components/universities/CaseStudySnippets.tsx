import React from 'react';
import Image from 'next/image';

export default function CaseStudySnippets() {
    const cases = [
        {
            id: 1,
            category: "University",
            title: "Increasing Retention by 20%",
            desc: "How a mid-sized Canadian university improved international student completion rates by partnering with Veda for pre-departure training.",
            image: "/images/universities/campus.png" // Reusing available asset
        },
        {
            id: 2,
            category: "Recruiter",
            title: "Hiring 50+ Veda Scholars",
            desc: "A leading tech consultancy in Berlin sourced 50+ pre-vetted junior developers directly from our graduate pool.",
            image: "/images/universities/hiring.png"
        }
    ];

    return (
        <section className="py-24 bg-slate-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">
                        Success Stories
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {cases.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-slate-100 group">
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary uppercase tracking-wider">
                                    {item.category}
                                </div>
                            </div>
                            <div className="p-8">
                                <h3 className="text-2xl font-bold text-primary mb-3 font-heading">
                                    {item.title}
                                </h3>
                                <p className="text-slate-600 leading-relaxed mb-6">
                                    {item.desc}
                                </p>
                                <a href="#" className="text-secondary font-bold hover:underline inline-flex items-center gap-2">
                                    Read Case Study &rarr;
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
