import React from 'react';
import Image from 'next/image';
import FadeIn from '@/components/animations/FadeIn';
import Button from '@/components/ui/Button';
import { Globe, Users, Award, ShieldCheck, Zap, Handshake } from 'lucide-react';

export default function UniversitiesContent() {
    const offers = [
        {
            icon: Users,
            title: "International Student Recruitment",
            desc: "We connect you with high-potential students from diverse backgrounds, ensuring a steady intake of quality applicants."
        },
        {
            icon: ShieldCheck,
            title: "Admission & Visa Guidance",
            desc: "Our team manages the entire application and visa process, reducing administrative burden and ensuring compliance."
        },
        {
            icon: Zap,
            title: "Employability Alignment",
            desc: "We work to align academic programs with industry needs, enhancing the employability of your graduates."
        },
        {
            icon: Award,
            title: "Scholarship Guidance",
            desc: "We assist students in identifying and applying for scholarships, making global education more accessible."
        },
        {
            icon: Handshake,
            title: "Long-term Partnerships",
            desc: "Build lasting relationships for student exchange, faculty collaboration, and joint research initiatives."
        }
    ];

    const whyPartner = [
        "Global education expertise with a deep understanding of market trends.",
        "Ethical and transparent recruitment processes.",
        "End-to-end student lifecycle support from inquiry to alumni.",
        "Strong network of employer connections for student placements."
    ];

    return (
        <div className="bg-white">
            {/* About Section */}
            <section className="py-16 md:py-20">
                <div className="container mx-auto px-4 md:px-6">
                    <FadeIn>
                        <div className="max-w-3xl mx-auto text-center">
                            <h2 className="text-3xl font-heading font-bold text-slate-900 mb-6">
                                Empowering Academic Excellence
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                Veda Scholars partners with world-class universities to streamline the admissions process and
                                ensure student success. We go beyond recruitment; we act as an extension of your team,
                                upholding your standards and values while expanding your global reach.
                            </p>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* What We Offer */}
            <section className="py-16 bg-slate-50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-heading font-bold text-slate-900 mb-4">
                            What We Offer <span className="text-[#B8860B]">Universities</span>
                        </h2>
                        <p className="text-slate-600">Comprehensive support to enhance your institution's global presence.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {offers.map((offer, index) => (
                            <FadeIn key={index} delay={index * 0.1}>
                                <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 h-full">
                                    <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center text-[#B8860B] mb-6">
                                        <offer.icon size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{offer.title}</h3>
                                    <p className="text-slate-600 leading-relaxed text-sm">
                                        {offer.desc}
                                    </p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Partner */}
            <section className="py-20">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <FadeIn direction="right">
                            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl group">
                                <Image
                                    src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80"
                                    alt="Global Partnership"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent"></div>

                                <div className="absolute bottom-8 left-8 right-8 text-white">
                                    <h3 className="text-2xl font-bold mb-2 text-white">Global Impact</h3>
                                    <p className="text-white text-sm font-medium">Connecting ambitious minds with world-class education.</p>
                                </div>
                            </div>
                        </FadeIn>

                        <FadeIn direction="left">
                            <h2 className="text-3xl font-heading font-bold text-slate-900 mb-8">
                                Why Partner with <br /><span className="text-[#B8860B]">Veda Scholars?</span>
                            </h2>
                            <ul className="space-y-4">
                                {whyPartner.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-4">
                                        <div className="mt-1 w-6 h-6 rounded-full bg-[#B8860B]/10 flex items-center justify-center text-[#B8860B] shrink-0">
                                            <ShieldCheck size={14} />
                                        </div>
                                        <p className="text-slate-700">{item}</p>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-10">
                                <Button href="/contact?type=partner" variant="primary" size="lg">
                                    Partner with Veda Scholars
                                </Button>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>
        </div>
    );
}
