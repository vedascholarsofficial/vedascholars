'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MessageCircle } from 'lucide-react';

function WhatsAppButtonContent() {
    const searchParams = useSearchParams();
    const type = searchParams.get('type');

    let message = "Hi Veda Scholars, I have an inquiry.";
    if (type === 'student') {
        message = "Hi Veda Scholars, I'm interested in student counselling.";
    } else if (type === 'partner') {
        message = "Hi Veda Scholars, I'd like to explore a university partnership.";
    } else if (type === 'recruiter') {
        message = "Hi Veda Scholars, I'm interested in recruitment and hiring solutions.";
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/917708722334?text=${encodedMessage}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#20bd5a] hover:scale-110 transition-all duration-300 flex items-center justify-center group"
            aria-label="Chat with us on WhatsApp"
        >
            <MessageCircle className="w-8 h-8" fill="white" stroke="white" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap pl-0 group-hover:pl-2 font-medium">
                Chat With Us
            </span>
        </a>
    );
}

export default function WhatsAppButton() {
    return (
        <Suspense fallback={null}>
            <WhatsAppButtonContent />
        </Suspense>
    );
}
