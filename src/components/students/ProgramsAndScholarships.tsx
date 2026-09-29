import React from 'react';
import FadeIn from '@/components/animations/FadeIn';
import { Award, CheckCircle } from 'lucide-react';

export default function ProgramsAndScholarships() {
    const programs = [
        "Bachelor's Programs", "Master's Programs", "MBA", "MBBS / Medicine",
        "AI & Data Science", "Engineering & STEM", "Law", "Liberal Arts", "Creative Arts"
    ];

    const scholarshipTypes = [
        { label: "Merit-based Scholarships", color: "bg-blue-50 text-blue-700 border-blue-100" },
        { label: "Government Funded", color: "bg-green-50 text-green-700 border-green-100" },
        { label: "University-specific", color: "bg-purple-50 text-purple-700 border-purple-100" },
        { label: "Fully Funded Options", color: "bg-amber-50 text-amber-700 border-amber-100" }
    ];

    return (
        <section className="py-16 md:py-24 bg-slate-50 border-t border-slate-200">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                    {/* Programs Section */}
                    <FadeIn direction="right">
                        <div>
                            <h2 className="text-3xl font-heading font-bold text-slate-900 mb-6">
                                Programs <span className="text-[#B8860B]">Offered</span>
                            </h2>
                            <p className="text-slate-600 mb-8">
                                We assist with applications to a wide range of study programs across various disciplines.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {programs.map((program, idx) => (
                                    <span
                                        key={idx}
                                        className="px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-sm text-slate-700 font-medium text-sm flex items-center gap-2"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#B8860B]"></div>
                                        {program}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </FadeIn>

                    {/* Scholarships Section */}
                    <FadeIn direction="left">
                        <div>
                            <h2 className="text-3xl font-heading font-bold text-slate-900 mb-6">
                                Scholarship <span className="text-[#B8860B]">Guidance</span>
                            </h2>
                            <p className="text-slate-600 mb-8">
                                Education shouldn't be a debt trap. We help you explore financial aid opportunities.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {scholarshipTypes.map((sch, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-4 rounded-xl border ${sch.color} flex items-center gap-3 transition-transform hover:-translate-y-1`}
                                    >
                                        <Award size={20} className="shrink-0" />
                                        <span className="font-semibold">{sch.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </FadeIn>

                </div>
            </div>
        </section>
    );
}
