import React from 'react';
import { Compass, GraduationCap, FileText, Banknote, Plane, BookOpen, Home } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';

export default function StudentServices() {
    const services = [
        {
            icon: Compass,
            title: "Career & Study Counselling",
            desc: "Discover the path that fits your strengths. We help you choose the right course and career trajectory."
        },
        {
            icon: GraduationCap,
            title: "University & Course Selection",
            desc: "Get matched with top global universities that align with your academic goals and budget."
        },
        {
            icon: FileText,
            title: "SOP & Documentation",
            desc: "Expert help to craft winning Statements of Purpose (SOPs), Resumes, and Letters of Recommendation."
        },
        {
            icon: Banknote,
            title: "Scholarships & Finance",
            desc: "We identify scholarship opportunities and assist with education loan applications to fund your dreams."
        },
        {
            icon: Plane,
            title: "Visa & Interview Prep",
            desc: "End-to-end visa guidance and mock interviews to ensure a stress-free approval process."
        },
        {
            icon: BookOpen,
            title: "Test Preparation",
            desc: "Comprehensive coaching for IELTS, TOEFL, PTE, GRE, and GMAT to help you score high."
        },
        {
            icon: Home,
            title: "Accommodation & Pre-Departure",
            desc: "We sort your housing, flights, and forex so you land ready to start your new life."
        }
    ];

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">
                        Key <span className="text-[#B8860B]">Services</span>
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        End-to-end support to ensure your journey from application to admission is smooth and successful.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => (
                        <FadeIn key={index} delay={index * 0.1}>
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-[#B8860B] shadow-sm mb-6">
                                    <service.icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-primary mb-3">{service.title}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed flex-grow">
                                    {service.desc}
                                </p>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
