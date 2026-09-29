'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Home, MessageCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

function ThankYouContent() {
    const searchParams = useSearchParams();
    const type = searchParams.get('type') || 'general';

    const getMessage = () => {
        switch (type) {
            case 'Student Counselling':
            case 'student':
                return {
                    title: "Your Journey Begins Here!",
                    message: "Thank you for reaching out. One of our academic counselors will review your profile and contact you within 24 hours to schedule your free session."
                };
            case 'University Partnership':
            case 'partner':
                return {
                    title: "Let’s Build the Future Together",
                    message: "Thank you for your interest in partnering with Veda Scholars. Our partnerships team will get in touch shortly to discuss how we can collaborate."
                };
            case 'Recruiter / Hiring':
            case 'recruiter':
                return {
                    title: "Connecting You with Top Talent",
                    message: "We appreciate your inquiry. Our placement cell will contact you within 24 hours to understand your hiring needs."
                };
            default:
                return {
                    title: "Thank You for Contacting Us",
                    message: "We have received your message. Our team is reviewing your inquiry and will get back to you within 24 hours."
                };
        }
    };

    const content = getMessage();

    return (
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100 max-w-2xl mx-auto text-center mx-4">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-300">
                <CheckCircle className="w-10 h-10 text-green-500" />
            </div>

            <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">
                {content.title}
            </h1>

            <p className="text-lg text-slate-300 mb-10 leading-relaxed">
                {content.message}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="primary" href="/" className="min-w-[180px] justify-center">
                    <Home className="w-4 h-4 mr-2" /> Back to Home
                </Button>

                {/* WhatsApp Chat Button */}
                <a
                    href={`https://wa.me/917530026193?text=${encodeURIComponent(
                        type === 'Student Counselling' || type === 'student' ? "Hi Veda Scholars, I'm interested in student counselling." :
                            type === 'University Partnership' || type === 'partner' ? "Hi Veda Scholars, I'd like to explore a university partnership." :
                                type === 'Recruiter / Hiring' || type === 'recruiter' ? "Hi Veda Scholars, I'm interested in recruitment and hiring solutions." :
                                    "Hi Veda Scholars, I have an inquiry."
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-11 px-6 rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95 group hover:-translate-y-0.5 border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white min-w-[180px]"
                >
                    <MessageCircle className="w-4 h-4 mr-2" /> Chat on WhatsApp
                </a>
            </div>
        </div>
    );
}

export default function ThankYouPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-24 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
            </div>

            <Suspense fallback={<div className="text-center text-slate-300">Loading...</div>}>
                <ThankYouContent />
            </Suspense>
        </div>
    );
}
