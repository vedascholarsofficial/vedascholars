import React from 'react';
import { Compass, GraduationCap, Zap, Briefcase, ChevronRight, CheckCircle2 } from 'lucide-react';
import * as motion from "framer-motion/client";

export default function ModelSection() {
    const steps = [
        {
            id: 1,
            title: "Career Guidance",
            icon: <Compass className="w-8 h-8 text-secondary" />,
            description: "Personalized pathfinding based on aptitude and market trends."
        },
        {
            id: 2,
            title: "Education Pathway",
            icon: <GraduationCap className="w-8 h-8 text-secondary" />,
            description: "Admission to top-tier universities worldwide."
        },
        {
            id: 3,
            title: "Skill Development",
            icon: <Zap className="w-8 h-8 text-secondary" />,
            description: "Industry-relevant training and certifications."
        },
        {
            id: 4,
            title: "Employment",
            icon: <Briefcase className="w-8 h-8 text-secondary" />,
            description: "Placement support with global recruiters."
        }
    ];

    const benefits = [
        {
            role: "Students",
            description: "Gain clarity, education, and employability in one seamless journey.",
            points: ["Career Roadmap", "Global Admission", "Job Placement"]
        },
        {
            role: "Universities",
            description: "Attract high-quality, pre-screened students ready for success.",
            points: ["Quality Intake", "Diverse Talent", "High Retention"]
        },
        {
            role: "Recruiters",
            description: "Access a pipeline of skilled, work-ready graduates.",
            points: ["Vetted Candidates", "Skill-Matched", "Immediate Impact"]
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-6">

                {/* Section Header */}
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">
                            Our Education to Employment Model
                        </h2>
                        <p className="text-lg text-slate-300">
                            A comprehensive ecosystem designed to bridge the gap between academic potential and professional success.
                        </p>
                    </motion.div>
                </div>

                {/* 4-Step Flow */}
                <div className="relative mb-24">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.id}
                                className="flex flex-col items-center text-center group"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                            >
                                <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/10 group-hover:-translate-y-2 transition-transform duration-300 relative z-10">
                                    {step.icon}
                                    {/* Connector Line (Desktop) */}
                                    {index < steps.length - 1 && (
                                        <motion.div
                                            className="hidden md:block absolute top-1/2 left-full bg-slate-200 -z-10 transform translate-x-4 origin-left"
                                            style={{ height: '2px', width: '100%' }}
                                            initial={{ scaleX: 0, opacity: 0 }}
                                            whileInView={{ scaleX: 1, opacity: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: (index * 0.2) + 0.4 }}
                                        >
                                            <div className="absolute right-0 -top-1.5 text-slate-300">
                                                <ChevronRight className="w-4 h-4" />
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">{step.title}</h3>
                                <p className="text-slate-300 leading-relaxed text-sm px-4">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Stakeholder Benefits */}
                <motion.div
                    className="bg-slate-50 rounded-3xl p-8 md:p-12"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {benefits.map((benefit) => (
                            <div key={benefit.role} className="flex flex-col">
                                <h3 className="text-2xl font-heading font-bold text-secondary mb-4">
                                    For {benefit.role}
                                </h3>
                                <p className="text-slate-300 mb-6 flex-grow">
                                    {benefit.description}
                                </p>
                                <ul className="space-y-3 mt-auto">
                                    {benefit.points.map((point) => (
                                        <li key={point} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                                            <CheckCircle2 className="w-5 h-5 text-primary/60" />
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
