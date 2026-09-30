import React from 'react';
import Image from 'next/image';
import { BookOpen, Briefcase, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

export default function ServiceDetailedList() {
    const services = [
        {
            id: 1,
            title: "Education Consultancy",
            icon: <BookOpen className="w-8 h-8 text-secondary" />,
            image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop", // Students in library
            description: "We navigate the complex landscape of global education to find the perfect fit for your ambitions. Our guidance goes beyond rankings; we look at curriculum, campus culture, and career outcomes.",
            target: "High School Graduates, Undergraduates, Professionals aiming for Masters.",
            outcome: "Admission to a top-tier university with a scholarship strategy.",
            points: [
                "Unbiased University Selection",
                "SOP & Essay Mentoring",
                "Application Strategy & Review",
                "Visa Interview Preparation"
            ]
        },
        {
            id: 2,
            title: "Recruitment & Placement",
            icon: <Briefcase className="w-8 h-8 text-secondary" />,
            image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop", // HR/Interview Scene - Professional & Neutral


            description: "Your degree is the starting line, not the finish. We actively connect our scholars with our network of global recruiters, ensuring your talent finds the right opportunity.",
            target: "Recent Graduates, Alumni, Skilled Professionals.",
            outcome: "Placement in a role that aligns with your qualifications and goals.",
            points: [
                "Resume & LinkedIn Optimization",
                "Mock Interviews with HR Experts",
                "Direct Referrals to Hiring Partners",
                "Salary Negotiation Guidance"
            ]
        },
        {
            id: 3,
            title: "Training & Skill Development",
            icon: <Zap className="w-8 h-8 text-secondary" />,
            image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop", // Classroom/Seminar
            description: "The skills gap is real. We bridge it by providing industry-endorsed certifications and soft-skills training that make you day-one ready for the corporate world.",
            target: "Students wanting to boost employability.",
            outcome: "Industry-ready certification and enhanced professional confidence.",
            points: [
                "Technical Bootcamps",
                "Corporate Communication Workshops",
                "Leadership & Teamwork Modules",
                "Real-world Capstone Projects"
            ]
        }
    ];

    return (
        <div className="bg-white">
            {services.map((service, index) => (
                <section key={service.id} className={`py-20 md:py-28 ${index % 2 === 1 ? 'bg-slate-50' : 'bg-white'}`}>
                    <div className="container mx-auto px-4 md:px-6">
                        <div className={`flex flex-col lg:flex-row gap-12 lg:gap-20 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>

                            {/* Content */}
                            <div className="w-full lg:w-1/2">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 bg-primary/5 rounded-xl flex items-center justify-center border border-primary/10">
                                        {service.icon}
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary">
                                        {service.title}
                                    </h2>
                                </div>

                                <p className="text-lg text-slate-600 leading-relaxed mb-8">
                                    {service.description}
                                </p>

                                <div className="mb-8 p-6 bg-white border border-slate-100 rounded-xl shadow-sm">
                                    <div className="mb-4">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-[0.15em] block mb-1">Who it is for</span>
                                        <p className="text-slate-700 font-medium">{service.target}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-[0.15em] block mb-1">Outcome</span>
                                        <p className="text-secondary font-bold flex items-center gap-2">
                                            <CheckCircle2 className="w-5 h-5" />
                                            {service.outcome}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                                    {service.points.map((point, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-slate-700">
                                            <div className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0"></div>
                                            <span className="text-sm">{point}</span>
                                        </div>
                                    ))}
                                </div>

                                <Button variant="primary" className="gap-2" href="/contact">
                                    Get Started <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Image Visual */}
                            <div className="w-full lg:w-1/2">
                                <div className="relative aspect-[4/3] w-full max-w-xl mx-auto rounded-2xl overflow-hidden shadow-2xl group">
                                    <Image
                                        src={service.image}
                                        alt={service.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>

                                    {/* Accent Shape */}
                                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl"></div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            ))}
        </div>
    );
}
