import React from 'react';
import { PlusCircle } from 'lucide-react';

export default function StudentFAQ() {
    const faqs = [
        {
            question: "When should I start my application process?",
            answer: "Ideally, you should start 10-12 months before your intended intake. This gives enough time for test preparation, university selection, and scholarship applications."
        },
        {
            question: "Do you help with scholarships?",
            answer: "Yes, identifying and applying for scholarships is a core part of our service. We help you draft essays that highlight your merit and need."
        },
        {
            question: "Which countries do you cover?",
            answer: "We specialize in top global destinations including the USA, UK, Canada, Australia, Germany, Ireland, and New Zealand."
        },
        {
            question: "Is there a fee for the initial consultation?",
            answer: "No, your first counselling session with Veda Scholars is completely free. We use this time to understand your profile and explain how we can help."
        }
    ];

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">
                        Common Questions
                    </h2>
                    <p className="text-slate-600">
                        Everything you need to know about starting your journey.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <details key={index} className="group p-6 bg-slate-50 rounded-xl hover:bg-white border border-transparent hover:border-slate-200 transition-all duration-300">
                            <summary className="flex items-center justify-between cursor-pointer list-none">
                                <h3 className="text-lg font-bold text-primary">{faq.question}</h3>
                                <PlusCircle className="w-6 h-6 text-secondary group-open:rotate-45 transition-transform duration-300" />
                            </summary>
                            <div className="mt-4 text-slate-600 leading-relaxed pl-1 pr-4">
                                <p>{faq.answer}</p>
                            </div>
                        </details>
                    ))}
                </div>

            </div>
        </section>
    );
}
