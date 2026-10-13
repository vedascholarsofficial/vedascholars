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
            desc: "Shortlist universities that fit your academic goals, preferences and budget."
        },
        {
            icon: FileText,
            title: "SOP & Documentation",
            desc: "Guidance on Statements of Purpose (SOPs) and CVs, and on how to request strong recommendation letters."
        },
        {
            icon: Banknote,
            title: "Scholarships & Finance",
            desc: "We help you identify scholarship opportunities and understand education loan options."
        },
        {
            icon: Plane,
            title: "Visa & Interview Prep",
            desc: "Guidance on visa requirements and documents, with mock interviews where relevant. Visa decisions rest with the authorities."
        },
        {
            icon: BookOpen,
            title: "Test Preparation",
            desc: "Guidance on IELTS, TOEFL, PTE, GRE and GMAT requirements and how to prepare."
        },
        {
            icon: Home,
            title: "Accommodation & Pre-Departure",
            desc: "Guidance on housing, travel and money so you arrive prepared. Bookings are arranged with you or through partners where available."
        }
    ];

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">
                        Key <span className="text-[#8B2BB4]">Services</span>
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        End-to-end support to ensure your journey from application to admission is smooth and successful.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => (
                        <FadeIn key={index} delay={index * 0.1}>
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-[#8B2BB4] shadow-sm mb-6">
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
