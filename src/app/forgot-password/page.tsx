'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { authService } from '@/services/authService';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            const data = await authService.forgotPassword(email);
            setStatus('success');
            setMessage(data.message || 'Recovery email transmitted successfully.');
        } catch (err: any) {
            setStatus('error');
            setMessage(err.response?.data?.message || 'Access denied or email does not match specific profile constraints.');
        } 
    };

    return (
        <section className="py-20 bg-slate-50 min-h-screen flex items-center justify-center">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-heading font-bold text-primary mb-2">Account Recovery</h2>
                        <p className="text-slate-600">Ensure the email exactly matches profile bounds.</p>
                    </div>

                    {status === 'success' && (
                        <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 text-sm border border-green-200 font-medium">
                            {message}
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm border border-red-100 font-medium">
                            {message}
                        </div>
                    )}

                    {status !== 'success' && (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Registered Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                    placeholder="your-account@domain.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={status === 'loading'}
                                />
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                fullWidth
                                className="justify-center h-12 text-lg shadow-xl shadow-primary/20"
                                disabled={status === 'loading'}
                            >
                                {status === 'loading' ? 'Encrypting & Transmitting...' : 'Dispatch Reset Link'}
                            </Button>
                        </form>
                    )}

                    <p className="text-sm text-center text-slate-500 mt-6">
                        Return to Authentication? <a href="/login" className="text-secondary font-medium hover:underline tracking-wide">Back to Sign In</a>
                    </p>
                </div>
            </div>
        </section>
    );
}
