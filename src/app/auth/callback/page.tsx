'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/authService';

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();
    const [status, setStatus] = useState('Signing you in...');

    useEffect(() => {
        // The API redirects here with a short-lived, single-use code. The token
        // itself is only ever returned in a POST response, never in the URL.
        const code = searchParams.get('code');
        let cancelled = false;

        // Remove the code from the address bar and browser history.
        window.history.replaceState(null, '', '/auth/callback');

        if (!code) {
            setStatus('Sign-in link is missing or has expired. Redirecting...');
            const timer = setTimeout(() => router.replace('/login'), 2000);
            return () => clearTimeout(timer);
        }

        authService
            .exchangeOAuthCode(code)
            .then((data) => {
                if (cancelled) return;
                const { token, ...userObj } = data;
                login(userObj, token);
                setStatus('Signed in. Taking you to your dashboard...');
                router.replace('/dashboard');
            })
            .catch(() => {
                if (cancelled) return;
                setStatus('This sign-in link has expired. Please sign in again.');
                setTimeout(() => router.replace('/login?auth=failed'), 2000);
            });

        return () => {
            cancelled = true;
        };
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
