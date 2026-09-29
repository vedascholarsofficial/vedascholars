import React from 'react';
import ContactHero from '@/components/contact/ContactHero';
import ContactForm from '@/components/contact/ContactForm';
import ContactInfo from '@/components/contact/ContactInfo';
import StudentFAQ from '@/components/students/StudentFAQ'; // Reusing for efficiency

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Veda Scholars | Book Free Counselling',
    description: 'Contact Veda Scholars to book free counselling, explore partnerships, or discuss recruitment opportunities.',
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <ContactHero />

            <section className="py-16 md:py-24 -mt-16 sm:-mt-12 relative z-20 px-4 md:px-6">
                <div className="container mx-auto max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                    <div className="flex flex-col lg:flex-row">
                        {/* Left Side: Info */}
                        <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-slate-100">
                            <ContactInfo />
                        </div>

                        {/* Right Side: Form */}
                        <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 bg-slate-50/50">
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </section>

            {/* Reuse FAQ as it is highly relevant here too */}
            <div className="border-t border-slate-200">
                <StudentFAQ />
            </div>
        </div>
    );
}
