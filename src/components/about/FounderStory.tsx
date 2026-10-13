import React from 'react';
import Image from 'next/image';
import { Linkedin, Quote } from 'lucide-react';
import Reveal, { ZoomImage } from '@/components/animations/Reveal';

export default function FounderStory() {
    return (
        <section className="relative py-16 md:py-28 bg-white overflow-hidden">
            <div className="absolute top-1/3 -left-40 w-[26rem] h-[26rem] rounded-full bg-accent/15 blur-3xl"></div>

            <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center">

                    {/* Founder Image */}
                    <div className="lg:col-span-5 relative w-full max-w-sm sm:max-w-md mx-auto lg:max-w-none">
                        {/* Decorative Frame */}
                        <Reveal variant="scale" delay={0.25} className="absolute inset-0 translate-x-3 translate-y-3 sm:translate-x-5 sm:translate-y-5 rounded-3xl border-2 border-secondary/25 bg-muted" />
                        <Reveal variant="mask" duration={1.1} className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden shadow-[0_30px_80px_-30px_rgba(36,17,45,0.45)]">
                            <ZoomImage className="absolute inset-0">
                                <Image
                                    src="/images/about/founder.png"
                                    alt="Founder of Veda Scholars"
                                    fill
                                    sizes="(min-width: 1024px) 34vw, 90vw"
                                    className="object-cover"
                                />
                            </ZoomImage>
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent"></div>
                        </Reveal>
                    </div>

                    {/* Founder Content */}
                    <div className="lg:col-span-7">
                        <Reveal>
                            <Quote className="w-10 h-10 md:w-12 md:h-12 text-secondary/30 mb-4 md:mb-6" aria-hidden="true" />
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-primary mb-6 md:mb-8 tracking-tight">
                                A Message from the Founder
                            </h2>
                        </Reveal>
                        <div className="space-y-5 md:space-y-6 text-slate-600 leading-relaxed text-base md:text-lg">
                            <Reveal delay={0.1}>
                                <p className="text-lg sm:text-xl md:text-2xl font-heading font-medium text-primary leading-snug">
                                    &ldquo;Education is not just about acquiring a degree; it is about building the foundation for a life of purpose and impact. Throughout my career, I have witnessed brilliant minds struggle not because of a lack of talent, but a lack of direction.&rdquo;
                                </p>
                            </Reveal>
                            <Reveal delay={0.2}>
                                <p>
                                    I founded Veda Scholars with a simple yet powerful resolve: to provide the mentorship I wish I had. We don&rsquo;t just process applications; we process dreams. We align your academic capabilities with industry realities to help your education lead to meaningful work.
                                </p>
                            </Reveal>
                            <Reveal delay={0.3}>
                                <p>
                                    At Veda Scholars, we value integrity above all. We will never recommend a path we wouldn&rsquo;t choose for our own children. That is my promise to you.&rdquo;
                                </p>
                            </Reveal>
                        </div>

                        <Reveal delay={0.4} className="mt-8 md:mt-10">
                            <Reveal variant="line" delay={0.5} duration={1.2} className="h-px w-full bg-gradient-to-r from-secondary/50 via-slate-200 to-transparent" />
                            <div className="pt-6 md:pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                                <div>
                                    <h4 className="font-heading font-bold text-xl md:text-2xl text-primary">Harish J</h4>
                                    <p className="text-secondary font-medium mt-1">Founder & Chief Consultant</p>
                                </div>
                                <a
                                    href="https://www.linkedin.com/in/harish-j-567a15224"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group inline-flex items-center gap-2 self-start sm:self-auto px-5 py-3 rounded-full border border-slate-200 bg-white text-primary shadow-sm hover:border-secondary hover:bg-secondary hover:text-white hover:shadow-lg hover:shadow-secondary/25 transition-all duration-300"
                                >
                                    <Linkedin className="w-5 h-5" />
                                    <span className="font-medium">Connect on LinkedIn</span>
                                </a>
                            </div>
                        </Reveal>
                    </div>

                </div>
            </div>
        </section>
    );
}
