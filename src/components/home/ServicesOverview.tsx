import React from 'react';
import { BookOpen, Briefcase, Zap, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

export default function ServicesOverview() {
    const services = [
        {
            id: 1,
            title: "Education Consultancy",
            description: "Expert guidance for students aiming for top-tier global universities.",
            outcome: "Outcome: Admission to your dream institution.",
            icon: <BookOpen className="w-10 h-10 text-white" />
        },
        {
            id: 2,
            title: "Recruitment & Placement",
            description: "Connecting talented graduates with leading global recruiters.",
            outcome: "Outcome: Launching your professional career.",
            icon: <Briefcase className="w-10 h-10 text-white" />
        },
        {
            id: 3,
            title: "Training & Skill Development",
            description: "Industry-aligned certifications and soft skills training.",
            outcome: "Outcome: Day-one job readiness.",
            icon: <Zap className="w-10 h-10 text-white" />
        }
    ];

    return (
        <section className="py-20 md:py-24 bg-primary text-white relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[32rem] h-[32rem] bg-secondary/25 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/15 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">

                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-white">
                            Comprehensive Services for <span className="text-accent">Lifelong Success</span>
                        </h2>
                        <p className="text-white/75 text-lg leading-relaxed">
                            We support the entire journey from academic planning to professional placement.
                        </p>
                    </div>
                    <Button variant="outline" href="/services" className="border-accent/60 text-white hover:bg-white hover:text-primary hover:border-white shrink-0">
                        Explore All Services
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service) => (
                        <div key={service.id} className="bg-white/[0.04] border border-white/10 p-8 rounded-2xl hover:bg-white/[0.08] hover:border-accent/40 hover:-translate-y-1 transition-all duration-300 group">
                            <div className="w-16 h-16 bg-gradient-to-br from-secondary to-[#5E1D7A] rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-105 shadow-lg shadow-secondary/30">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">{service.title}</h3>
                            <p className="text-white/75 mb-6 leading-relaxed">
                                {service.description}
                            </p>
                            <div className="flex items-center gap-2 text-sm font-semibold text-accent">
                                <span className="w-2 h-2 rounded-full bg-accent shrink-0"></span>
                                {service.outcome}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <Button variant="outline" href="/services" className="w-full border-accent/60 text-white hover:bg-white hover:text-primary hover:border-white">
                        Explore All Services
                    </Button>
                </div>

            </div>
        </section>
    );
}
