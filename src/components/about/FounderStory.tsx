import React from 'react';
import Image from 'next/image';
import { Linkedin } from 'lucide-react';

export default function FounderStory() {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row items-center gap-16">

                    {/* Founder Image */}
                    <div className="w-full md:w-1/2 relative">
                        <div className="relative aspect-[4/5] w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-xl">
                            <Image
                                src="/images/about/founder.png"
                                alt="Founder of Veda Scholars"
                                fill
                                className="object-cover"
                            />
                        </div>
                        {/* Decorative Element */}
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary/10 rounded-full -z-10 hidden md:block"></div>
                        <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/5 rounded-full -z-10 hidden md:block"></div>
                    </div>

                    {/* Founder Content */}
                    <div className="w-full md:w-1/2">
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-6">
                            A Message from the Founder
                        </h2>
                        <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
                            <p>
                                "Education is not just about acquiring a degree; it is about building the foundation for a life of purpose and impact. Throughout my career, I have witnessed brilliant minds struggle not because of a lack of talent, but a lack of direction."
                            </p>
                            <p>
                                I founded Veda Scholars with a simple yet powerful resolve: to provide the mentorship I wish I had. We don't just process applications; we process dreams. We align your academic capabilities with industry realities to ensure that your education leads to meaningful employment.
                            </p>
                            <p>
                                At Veda Scholars, we value integrity above all. We will never recommend a path we wouldn't choose for our own children. That is my promise to you."
                            </p>

                            <div className="pt-6">
                                <h4 className="font-heading font-bold text-xl text-primary">Harish J</h4>
                                <p className="text-secondary font-medium">Founder & Chief Consultant</p>
                                <div className="mt-3">
                                    <a
                                        href="https://www.linkedin.com/in/harish-j-567a15224"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-primary hover:text-secondary transition-colors"
                                    >
                                        <Linkedin className="w-5 h-5" />
                                        <span className="font-medium">Connect on LinkedIn</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
