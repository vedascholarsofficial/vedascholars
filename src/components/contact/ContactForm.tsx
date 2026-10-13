'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Script from 'next/script';
import Button from '../ui/Button';
import { Send, CheckCircle, MessageCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { CONSENT_TEXT, INTERESTS, type FieldErrors } from '@/lib/leads/schema';

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const INTEREST_BY_TYPE: Record<string, string> = {
    student: 'Student Counselling',
    partner: 'University Partnership',
    recruiter: 'Employer Partnership',
    employer: 'Employer Partnership',
};

const emptyForm = {
    name: '',
    email: '',
    phone: '',
    interest: 'General Inquiry',
    consent: false,
};

const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 rounded-xl border ${hasError ? 'border-red-400' : 'border-slate-200'} focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none`;

function ContactFormContent() {
    const searchParams = useSearchParams();
    // Pre-select the enquiry type from links such as /contact?type=student.
    const [formData, setFormData] = useState(() => ({
        ...emptyForm,
        interest: INTEREST_BY_TYPE[searchParams.get('type') || ''] ?? emptyForm.interest,
    }));
    const [submittedInterest, setSubmittedInterest] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [reference, setReference] = useState<string | null>(null);
    const [formError, setFormError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    // When the form was first shown; the server rejects instant (bot) submissions.
    const startedAt = useRef<number>(0);

    useEffect(() => {
        startedAt.current = Date.now();
    }, []);

    const update = (field: keyof typeof emptyForm, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (fieldErrors[field as keyof FieldErrors]) {
            setFieldErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormError('');
        setFieldErrors({});

        const formElement = new FormData(e.currentTarget);
        const utm: Record<string, string> = {};
        for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']) {
            const value = searchParams.get(key);
            if (value) utm[key] = value;
        }

        try {
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    startedAt: startedAt.current,
                    company_website: formElement.get('company_website') || '',
                    turnstileToken: formElement.get('cf-turnstile-response') || undefined,
                    sourcePage: window.location.pathname,
                    utm,
                }),
            });
            const result = await response.json().catch(() => null);

            // Success is shown only when the server confirms it accepted the enquiry.
            if (response.status === 201 && result?.ok) {
                setSubmittedInterest(formData.interest);
                setReference(result.reference ?? null);
                setIsSuccess(true);
                setFormData(emptyForm);
                startedAt.current = Date.now();
                return;
            }

            if (result?.fieldErrors) setFieldErrors(result.fieldErrors);
            setFormError(
                result?.message ||
                'We could not submit your enquiry. Please try again, or call +91 7708722334 / message us on WhatsApp.'
            );
        } catch {
            setFormError(
                'We could not reach our server. Please check your connection and try again, or call +91 7708722334 / message us on WhatsApp.'
            );
        } finally {
            setIsSubmitting(false);
            // A Turnstile token is single-use; get a fresh one for any retry.
            (window as unknown as { turnstile?: { reset: () => void } }).turnstile?.reset();
        }
    };

    if (isSuccess) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 h-full flex flex-col items-center justify-center text-center space-y-4 min-h-[500px]">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-primary">Thank You!</h2>
                <p className="text-slate-600 text-lg">We have received your enquiry and will contact you shortly.</p>
                {reference && (
                    <p className="text-sm text-slate-500">Your reference: <span className="font-semibold text-slate-700">{reference}</span></p>
                )}

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
            {TURNSTILE_SITE_KEY && (
                <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
            )}
            <h2 className="text-2xl font-bold text-primary mb-6">Book Your Free Consultation</h2>
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div role="alert" aria-live="assertive">
                    {formError && (
                        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="contact-name" className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                    <input
                        id="contact-name"
                        name="name"
                        type="text"
                        required
                        autoComplete="name"
                        maxLength={100}
                        aria-invalid={!!fieldErrors.name}
                        aria-describedby={fieldErrors.name ? 'contact-name-error' : undefined}
                        className={inputClass(!!fieldErrors.name)}
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => update('name', e.target.value)}
                        disabled={isSubmitting}
                    />
                    {fieldErrors.name && <p id="contact-name-error" className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>}
                </div>

                <div>
                    <label htmlFor="contact-email" className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                    <input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        maxLength={254}
                        aria-invalid={!!fieldErrors.email}
                        aria-describedby={fieldErrors.email ? 'contact-email-error' : undefined}
                        className={inputClass(!!fieldErrors.email)}
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => update('email', e.target.value)}
                        disabled={isSubmitting}
                    />
                    {fieldErrors.email && <p id="contact-email-error" className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>}
                </div>

                <div>
                    <label htmlFor="contact-phone" className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                    <input
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        required
                        autoComplete="tel"
                        maxLength={25}
                        aria-invalid={!!fieldErrors.phone}
                        aria-describedby={fieldErrors.phone ? 'contact-phone-error' : undefined}
                        className={inputClass(!!fieldErrors.phone)}
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => update('phone', e.target.value)}
                        disabled={isSubmitting}
                    />
                    {fieldErrors.phone && <p id="contact-phone-error" className="mt-1 text-sm text-red-600">{fieldErrors.phone}</p>}
                </div>

                <div>
                    <label htmlFor="contact-interest" className="block text-sm font-medium text-slate-700 mb-2">Purpose of Inquiry</label>
                    <select
                        id="contact-interest"
                        name="interest"
                        className={`${inputClass(!!fieldErrors.interest)} bg-white`}
                        value={formData.interest}
                        onChange={(e) => update('interest', e.target.value)}
                        disabled={isSubmitting}
                    >
                        {INTERESTS.map((option) => (
                            <option key={option}>{option}</option>
                        ))}
                    </select>
                </div>

                {/* Honeypot: hidden from people and assistive technology; bots tend to fill it. */}
                <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
                    <label htmlFor="contact-company-website">Company website</label>
                    <input id="contact-company-website" name="company_website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
                </div>

                <div>
                    <label htmlFor="contact-consent" className="flex items-start gap-3 text-sm text-slate-600">
                        <input
                            id="contact-consent"
                            name="consent"
                            type="checkbox"
                            className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300"
                            checked={formData.consent}
                            onChange={(e) => update('consent', e.target.checked)}
                            aria-invalid={!!fieldErrors.consent}
                            aria-describedby={fieldErrors.consent ? 'contact-consent-error' : undefined}
                            disabled={isSubmitting}
                        />
                        <span>
                            {CONSENT_TEXT.replace(' as described in the privacy policy.', ' as described in our ')}
                            <a href="/privacy-policy" className="underline hover:text-primary">privacy policy</a>.
                        </span>
                    </label>
                    {fieldErrors.consent && <p id="contact-consent-error" className="mt-1 text-sm text-red-600">{fieldErrors.consent}</p>}
                </div>

                {TURNSTILE_SITE_KEY && <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} />}

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
                    We use your details only to respond to your enquiry. See our <a href="/privacy-policy" className="underline hover:text-primary">privacy policy</a>.
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
