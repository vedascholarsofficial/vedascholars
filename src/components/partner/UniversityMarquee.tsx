import React from 'react';

export default function UniversityMarquee() {
    const universities = [
        "Harvard University", "University of Oxford", "MIT", "Stanford University",
        "University of Cambridge", "University of Toronto", "University of Melbourne",
        "National University of Singapore", "Yale University", "Princeton University",
        "Imperial College London", "ETH Zurich", "University of Chicago"
    ];

    return (
        <section className="py-10 bg-slate-900 overflow-hidden border-y border-slate-800">
            <div className="relative w-full max-w-[100vw]">
                {/* Gradient Masks */}
                <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none"></div>

                <div className="flex w-max animate-marquee">
                    {/* First Loop */}
                    <div className="flex items-center gap-12 px-6">
                        {universities.map((uni, index) => (
                            <div key={`uni-1-${index}`} className="flex items-center gap-4 group cursor-default">
                                <span className="text-xl md:text-2xl font-heading font-bold text-slate-400 group-hover:text-[#B8860B] transition-colors duration-300 whitespace-nowrap">
                                    {uni}
                                </span>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] opacity-50 block"></span>
                            </div>
                        ))}
                    </div>
                    {/* Second Loop (Duplicate for seamless scroll) */}
                    <div className="flex items-center gap-12 px-6">
                        {universities.map((uni, index) => (
                            <div key={`uni-2-${index}`} className="flex items-center gap-4 group cursor-default">
                                <span className="text-xl md:text-2xl font-heading font-bold text-slate-400 group-hover:text-[#B8860B] transition-colors duration-300 whitespace-nowrap">
                                    {uni}
                                </span>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] opacity-50 block"></span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
