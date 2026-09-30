'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();
    const [status, setStatus] = useState('Intercepting authentication payload...');

    useEffect(() => {
        // Automatically fires on load resolving the URL queries
        const token = searchParams.get('token');
        const userEncodedData = searchParams.get('user');

        if (token && userEncodedData) {
            try {
                // Decode specifically formatted URL strings passed safely from Express Passport
                const userObj = JSON.parse(decodeURIComponent(userEncodedData));
                
                // Immediately commit to Application Context & Session Storage
                login(userObj, token);
                setStatus('Identity validated. Routing securely to dashboard...');
                
                setTimeout(() => {
                    router.replace('/dashboard');
                }, 1000);
            } catch (error) {
                console.error("Payload Decoding Failed:", error);
                setStatus('Fatal error: Authentication payload is inherently corrupted.');
                setTimeout(() => router.replace('/login'), 3000);
            }
        } else {
             // If accessed manually without payload vectors.
             setStatus('Missing required OAuth payload arrays. Redirecting...');
             setTimeout(() => router.replace('/login'), 2000);
        }
    }, [searchParams, router, login]);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="w-16 h-16 border-4 border-[#8B2BB4] border-t-transparent rounded-full animate-spin mb-6"></div>
            <h2 className="text-xl font-heading font-bold text-primary mb-2">Synchronizing Credentials</h2>
            <p className="text-slate-500 font-medium animate-pulse">{status}</p>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={null}>
            <AuthCallbackContent />
        </Suspense>
    );
}
