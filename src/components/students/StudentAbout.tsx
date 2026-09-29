import React from 'react';
import FadeIn from '@/components/animations/FadeIn';

export default function StudentAbout() {
    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6 text-center">
                <FadeIn>
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-6">
                        About <span className="text-[#B8860B]">Veda Scholars</span>
                    </h2>
                    <div className="max-w-3xl mx-auto space-y-4 text-lg text-slate-600 leading-relaxed">
                        <p>
                            At Veda Scholars, we believe that education is the most powerful tool to change the world.
                            Our mission is to guide students towards their dream careers by providing ethical, transparent,
                            and personalized counselling.
                        </p>
                        <p>
                            We go beyond just admissions. We focus on your long-term success, helping you choose the
                            right path, secure scholarships, and prepare for a global career. With Veda Scholars,
                            you are not just applying to a university; you are building your future.
                        </p>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
