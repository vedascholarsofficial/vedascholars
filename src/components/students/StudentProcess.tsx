import React from 'react';
import { Search, PenTool, Plane, GraduationCap, Briefcase } from 'lucide-react';
import * as motion from "framer-motion/client";

export default function StudentProcess() {
    const steps = [
        {
            id: 1,
            title: "Discovery",
            description: "We start by listening. Understanding your interests, academic profile, and life goals.",
            icon: <Search className="w-6 h-6" />
        },
        {
            id: 2,
            title: "Selection",
            description: "Curating a list of universities and courses that match your aspirations and budget.",
            icon: <PenTool className="w-6 h-6" />
        },
        {
            id: 3,
            title: "Application",
            description: "Crafting a compelling narrative through your SOPs and essays ensuring flawless submissions.",
            icon: <GraduationCap className="w-6 h-6" />
        },
        {
            id: 4,
            title: "Visa & Finances",
            description: "Navigating scholarship opportunities and simplifying the complex visa process.",
            icon: <Plane className="w-6 h-6" />
        },
        {
            id: 5,
            title: "Pre-departure",
            description: "Preparing you for life abroad, from accommodation to cultural adaptation.",
            icon: <Briefcase className="w-6 h-6" />
        }
    ];

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">
                            How We Guide You
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            A structured, stress-free journey from your first question to your first day on campus.
                        </p>
                    </motion.div>
                </div>

                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <motion.div
                        className="hidden md:block absolute top-1/2 left-0 h-1 bg-slate-100 -translate-y-1/2 z-0 w-full origin-left"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.id}
                                className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 text-center group"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
                            >
                                <motion.div
                                    className="w-14 h-14 bg-white border-2 border-secondary text-secondary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary group-hover:text-white transition-colors"
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.15 + 0.4 }}
                                >
                                    {step.icon}
                                </motion.div>
                                <h3 className="text-lg font-bold text-primary mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
