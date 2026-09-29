'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
    {
        question: 'Is applying through Veda Scholars free?',
        answer:
            'Yes, submitting your application is completely free of charge. We do not levy any registration or processing fee from candidates. Our revenue comes from our employer partners, ensuring your journey with us is 100% cost-free.',
    },
    {
        question: 'Which countries do you recruit for?',
        answer:
            'We currently recruit for opportunities in India, the United Kingdom, the United Arab Emirates, and other GCC countries. Our employer network is continuously expanding to cover more regions globally.',
    },
    {
        question: 'Do you guarantee a job placement?',
        answer:
            'While we do not guarantee placement — as hiring decisions ultimately rest with the employer — we do guarantee that every qualified candidate receives active representation, personalised matching, and dedicated support throughout the process.',
    },
    {
        question: 'How long does the recruitment process take?',
        answer:
            'From submission to first employer contact, the typical turnaround is 5–10 business days. The full process from application to offer can range from 3 to 8 weeks depending on the role, country, and employer timeline.',
    },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border border-slate-200 rounded-xl overflow-hidden transition-shadow hover:shadow-md">
            <button
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left bg-white hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#C6A94A]"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
            >
                <span className="text-base font-semibold text-[#0B1F3A] leading-snug">{question}</span>
                <ChevronDown
                    className={`flex-shrink-0 w-5 h-5 text-[#C6A94A] transition-transform duration-300 ${open ? 'rotate-180' : ''
                        }`}
                />
            </button>
            <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${open ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <p className="px-6 pb-5 text-slate-600 leading-relaxed text-sm border-t border-slate-100 pt-4">
                    {answer}
                </p>
            </div>
        </div>
    );
}

export default function FaqAccordion() {
    return (
        <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq) => (
                <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
        </div>
    );
}
