import React from 'react';
import { Filter, GraduationCap, Building2, Handshake } from 'lucide-react';
import Image from 'next/image';
import * as motion from "framer-motion/client";

export default function PartnershipProcess() {
    const steps = [
        {
            id: 1,
            title: "Rigorous Vetting",
            description: "We don't flood you with applications. We pre-screen valid academic credentials and financial viability.",
            icon: <Filter className="w-6 h-6 text-white" />
        },
        {
            id: 2,
            title: "Targeted Training",
            description: "Students undergo pre-departure training on academic integrity and cultural adaptation.",
            icon: <GraduationCap className="w-6 h-6 text-white" />
        },
        {
            id: 3,
            title: "Seamless Enrollment",
            description: "Our team ensures all documentation is perfect for a smooth enrollment process.",
            icon: <Building2 className="w-6 h-6 text-white" />
        },
        {
            id: 4,
            title: "Career Integration",
            description: "We work with recruiters to place graduates, boosting your university's employability stats.",
            icon: <Handshake className="w-6 h-6 text-white" />
        }
    ];

    return (
        <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 items-center">

                    <div className="w-full lg:w-1/2">
                        <motion.h2
                            className="text-3xl md:text-4xl font-heading font-bold mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            A Partnership Built on <span className="text-secondary">Trust & Quality</span>
                        </motion.h2>
                        <motion.p
                            className="text-slate-300 mb-12 text-lg leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            Our process is designed to minimize administrative burden for your admissions team while maximizing student quality.
                        </motion.p>

                        <div className="space-y-8">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={step.id}
                                    className="flex gap-6"
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.15 + 0.2 }}
                                >
                                    <div className="relative">
                                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center border border-white/10 relative z-10">
                                            {step.icon}
                                        </div>
                                        {index !== steps.length - 1 && (
                                            <motion.div
                                                className="absolute top-12 left-6 w-0.5 bg-white/10 -ml-px h-full origin-top"
                                                initial={{ scaleY: 0 }}
                                                whileInView={{ scaleY: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.5, delay: index * 0.15 + 0.4 }}
                                            ></motion.div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                                        <p className="text-slate-400 leading-relaxed text-sm">
                                            {step.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2">
                        <div className="relative aspect-[4/5] w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                            <Image
                                src="/images/universities/campus.png"
                                alt="University Collaboration"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/90 to-transparent">
                                <p className="text-white font-heading text-2xl">
                                    "Veda Scholars brings us students who are not just academically sound, but culturally prepared."
                                </p>
                                <p className="text-secondary mt-2 text-sm font-bold uppercase tracking-wider">
                                    - Dean of Admissions, UK University Partner
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
