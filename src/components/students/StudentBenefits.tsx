import React from 'react';
import { UserCheck, Banknote, Home, Network } from 'lucide-react';
import Image from 'next/image';

export default function StudentBenefits() {
    const benefits = [
        {
            id: 1,
            title: "Personal Mentorship",
            description: "You are not a file number. You get a dedicated mentor who knows your story and guides you personally.",
            icon: <UserCheck className="w-8 h-8 text-primary" />
        },
        {
            id: 2,
            title: "Scholarship Support",
            description: "We have helped students secure over $5M in scholarships. We identify every financial aid opportunity.",
            icon: <Banknote className="w-8 h-8 text-primary" />
        },
        {
            id: 3,
            title: "Post-Arrival Care",
            description: "Our job isn't done when you fly. We help with accommodation, bank accounts, and settling in.",
            icon: <Home className="w-8 h-8 text-primary" />
        },
        {
            id: 4,
            title: "Global Network",
            description: "Join an exclusive community of Veda Scholars alumni working in top companies worldwide.",
            icon: <Network className="w-8 h-8 text-primary" />
        }
    ];

    return (
        <section className="py-24 bg-slate-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* Image Side */}
                    <div className="w-full lg:w-1/2">
                        <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-xl border-8 border-white">
                            <Image
                                src="/images/students/campus.png"
                                alt="Vibrant Campus Life"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="w-full lg:w-1/2">
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-8">
                            Why Students Trust Us
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {benefits.map((benefit) => (
                                <div key={benefit.id} className="flex flex-col gap-4">
                                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                                        {benefit.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-primary mb-2">{benefit.title}</h3>
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            {benefit.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}
