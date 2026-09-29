import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import FadeIn from '@/components/animations/FadeIn';
import { Heart, Zap, Globe, Users, ArrowRight, Briefcase, GraduationCap } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Careers | Join Veda Scholars',
    description: 'Join our mission to democratize access to global education. Explore career opportunities at Veda Scholars.',
};

export default function CareersPage() {
    return (
        <div className="bg-slate-50 min-h-screen">
            {/* 1. Careers Hero Section */}
            <section className="relative py-24 bg-primary text-white overflow-hidden">
                {/* Abstract Background */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>

                <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
                    <FadeIn>
                        <span className="inline-block py-1 px-3 rounded-full bg-secondary/20 border border-secondary/30 text-secondary text-sm font-medium mb-6">
                            We are Hiring
                        </span>
                        <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 text-white">
                            Build the Future of <br className="hidden md:block" />
                            <span className="text-secondary">Global Education</span>
                        </h1>
                        <p className="text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed mb-8">
                            We are on a mission to democratize access to world-class education.
                            Join a team where your work directly impacts the lives and careers of students worldwide.
                        </p>
                        <Button href="#openings" variant="primary" size="lg" className="shadow-xl shadow-secondary/20">
                            View Open Positions
                        </Button>
                    </FadeIn>
                </div>
            </section>

            {/* 2. Why Work With Us */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <FadeIn>
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">Why Work With Us?</h2>
                            <p className="text-slate-300 text-lg">
                                We believe in growing together. At Veda Scholars, you're not just an employee; you're a partner in our vision.
                            </p>
                        </div>
                    </FadeIn>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FadeIn delay={0.1}>
                            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-all duration-300 h-full">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-primary mb-6">
                                    <Users className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-primary mb-3">Inclusive Culture</h3>
                                <p className="text-slate-300 leading-relaxed">
                                    A collaborative environment where every voice matters. We celebrate diversity and handle challenges as a team.
                                </p>
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.2}>
                            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-all duration-300 h-full">
                                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mb-6">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-primary mb-3">Accelerated Growth</h3>
                                <p className="text-slate-300 leading-relaxed">
                                    We are a fast-growing consultancy. High performers are rewarded with rapid career progression and leadership opportunities.
                                </p>
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.3}>
                            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-all duration-300 h-full">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6">
                                    <GraduationCap className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-primary mb-3">Continuous Learning</h3>
                                <p className="text-slate-300 leading-relaxed">
                                    Access to global education resources, training sessions, and the chance to interact with top universities globally.
                                </p>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* 3. Our Values */}
            <section className="py-20 bg-primary text-white relative overflow-hidden">
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <FadeIn direction="right">
                            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6 text-white">
                                Driven by <span className="text-secondary">Values</span>
                            </h2>
                            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                                Our core values guide every decision we make, ensuring we stay true to our mission while delivering excellence.
                            </p>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                                        <Heart className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">Student-First Mindset</h3>
                                        <p className="text-slate-400">We prioritize the student's best interest above all else, always.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                                        <Globe className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">Integrity & Transparency</h3>
                                        <p className="text-slate-400">We build trust through honest, clear, and ethical guidance.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                                        <Zap className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">Innovation & Collaboration</h3>
                                        <p className="text-slate-400">We constantly evolve our methods and work together to solve complex problems.</p>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>

                        <FadeIn direction="left" delay={0.2}>
                            {/* Visual Placeholder for Values - Using abstract shapes if no image */}
                            <div className="relative h-[400px] w-full bg-white/5 rounded-2xl border border-white/10 p-8 flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent opacity-50"></div>
                                <div className="text-center relative z-10">
                                    <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 rounded-full backdrop-blur-md mb-6 border border-white/20">
                                        <Briefcase className="w-10 h-10 text-secondary" />
                                    </div>
                                    <h4 className="text-2xl font-heading text-white font-bold">Join the Movement</h4>
                                    <p className="text-slate-400 mt-2">Be part of something bigger.</p>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* 4. Current Openings */}
            <section id="openings" className="py-24 bg-slate-50">
                <div className="container mx-auto px-4 md:px-6">
                    <FadeIn>
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">Current Openings</h2>
                            <p className="text-slate-300 text-lg">Find your role and make an impact.</p>
                        </div>
                    </FadeIn>

                    <div className="max-w-4xl mx-auto space-y-4">
                        {/* Job Card 1 */}
                        <FadeIn delay={0.1}>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-secondary/50 transition-colors group">
                                <div>
                                    <h3 className="text-xl font-bold text-primary group-hover:text-secondary transition-colors">Education Counsellor</h3>
                                    <div className="flex gap-4 text-sm text-slate-300 mt-2">
                                        <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> Full-time</span>
                                        <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Remote / Hybrid</span>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" href="/contact?subject=Application for Education Counsellor">
                                    Apply Now <ArrowRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        </FadeIn>

                        {/* Job Card 2 */}
                        <FadeIn delay={0.2}>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-secondary/50 transition-colors group">
                                <div>
                                    <h3 className="text-xl font-bold text-primary group-hover:text-secondary transition-colors">Digital Marketing Executive</h3>
                                    <div className="flex gap-4 text-sm text-slate-300 mt-2">
                                        <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> Full-time</span>
                                        <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Remote</span>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" href="/contact?subject=Application for Digital Marketing Executive">
                                    Apply Now <ArrowRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        </FadeIn>

                        {/* Job Card 3 */}
                        <FadeIn delay={0.3}>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-secondary/50 transition-colors group">
                                <div>
                                    <h3 className="text-xl font-bold text-primary group-hover:text-secondary transition-colors">Student Success Associate</h3>
                                    <div className="flex gap-4 text-sm text-slate-300 mt-2">
                                        <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> Full-time</span>
                                        <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> On-site</span>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" href="/contact?subject=Application for Student Success Associate">
                                    Apply Now <ArrowRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* 5. How to Apply */}
            <section className="py-20 bg-white border-t border-slate-100">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <FadeIn>
                        <div className="max-w-2xl mx-auto bg-primary/5 p-8 rounded-2xl">
                            <h2 className="text-2xl font-bold text-primary mb-4">Don't see a role for you?</h2>
                            <p className="text-slate-300 mb-6">
                                We are always looking for talented individuals. If you share our values and vision, we'd love to hear from you.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button variant="primary" href="/contact?subject=General Application">
                                    Send General Application
                                </Button>
                            </div>
                            <p className="text-slate-400 text-sm mt-4">
                                Send your CV and a brief cover letter to <span className="font-medium text-slate-700">careers@vedascholars.com</span>
                            </p>
                        </div>
                    </FadeIn>
                </div>
            </section>
        </div>
    );
}
