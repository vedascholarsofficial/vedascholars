'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Button from '../ui/Button';
import { Send, CheckCircle, MessageCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

function ContactFormContent() {
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        interest: 'General Inquiry'
    });
    const [submittedInterest, setSubmittedInterest] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        const type = searchParams.get('type');
        if (type === 'student') {
            setFormData(prev => ({ ...prev, interest: 'Student Counselling' }));
        } else if (type === 'partner') {
            setFormData(prev => ({ ...prev, interest: 'University Partnership' }));
        } else if (type === 'recruiter') {
            setFormData(prev => ({ ...prev, interest: 'Employer Partnership' }));
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Store the interest before resetting for the success message context
        setSubmittedInterest(formData.interest);

        const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeAVDv3Z-0Yon14J1dQPcp3JUjRiiDzWhjsaieg1qbNbdW-Kw/formResponse';

        const formBody = new FormData();
        formBody.append('entry.203752787', formData.name);
        formBody.append('entry.1269060423', formData.email);
        formBody.append('entry.1933473105', formData.phone);
        formBody.append('entry.1414328682', formData.interest);

        try {
            await fetch(GOOGLE_FORM_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: formBody,
            });

            // Google Forms with no-cors returns an opaque response, so we verify by assuming success if no network error occurred.
            setIsSuccess(true);
            setFormData({
                name: '',
                email: '',
                phone: '',
                interest: 'General Inquiry'
            });

        } catch (error) {
            console.error('Submission error:', error);
            alert('Error submitting form. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 h-full flex flex-col items-center justify-center text-center space-y-4 min-h-[500px]">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-primary">Thank You!</h2>
                <p className="text-slate-600 text-lg">We’ll contact you shortly.</p>

                <div className="flex flex-col gap-3 w-full max-w-xs mt-4">
                    <a
                        href={`https://wa.me/917530026193?text=${encodeURIComponent(
                            submittedInterest === 'Student Counselling' ? "Hi Veda Scholars, I'm interested in student counselling." :
                                submittedInterest === 'University Partnership' ? "Hi Veda Scholars, I'd like to explore a university partnership." :
                                    submittedInterest === 'Employer Partnership' ? "Hi Veda Scholars, I'm interested in recruitment and hiring solutions." :
                                        "Hi Veda Scholars, I have an inquiry."
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center h-12 px-6 rounded-xl font-medium transition-all duration-300 border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white w-full"
                    >
                        <MessageCircle className="w-5 h-5 mr-2" /> Chat on WhatsApp
                    </a>

                    <Button
                        variant="outline"
                        onClick={() => setIsSuccess(false)}
                        className="w-full justify-center h-12"
                    >
                        Send Another Message
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
            <h2 className="text-2xl font-bold text-primary mb-6">Book Your Free Consultation</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                    <input
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={isSubmitting}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                    <input
                        type="email"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={isSubmitting}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                    <input
                        type="tel"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={isSubmitting}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Purpose of Inquiry</label>
                    <select
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none bg-white"
                        value={formData.interest}
                        onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                        disabled={isSubmitting}
                    >
                        <option>General Inquiry</option>
                        <option>Student Counselling</option>
                        <option>University Partnership</option>
                        <option>Employer Partnership</option>
                    </select>
                </div>

                <Button
                    id="form-consultation-submit"
                    type="submit"
                    variant="primary"
                    className="w-full md:w-auto md:px-12 justify-center py-4 text-lg shadow-xl shadow-primary/20 transition-transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed gap-2 whitespace-nowrap"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                    {!isSubmitting && <Send className="w-5 h-5" />}
                </Button>

                <p className="text-xs text-slate-400 text-center mt-4">
                    By submitting this form, you agree to our <a href="/privacy-policy" className="underline hover:text-primary">privacy policy</a>. Your information is safe with us.
                </p>
            </form>
        </div>
    );
}

export default function ContactForm() {
    return (
        <Suspense fallback={<div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 h-[600px] flex items-center justify-center">Loading form...</div>}>
            <ContactFormContent />
        </Suspense>
    );
}
