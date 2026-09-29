'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { authService } from '@/services/authService';
import { useRouter } from 'next/navigation';

interface Props {
    params: Promise<{ token: string }>;
}

export default function ResetPasswordPage({ params }: Props) {
    // Next.js 15+ compatible parameter unwrapping
    const resolvedParams = React.use(params);
    const token = resolvedParams.token;
    
    const router = useRouter();
    
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirm) {
            setStatus('error');
            setMessage('Secure password constraints mismatch.');
            return;
        }

        setStatus('loading');
        setMessage('');

        try {
            const data = await authService.resetPassword(token, password);
            setStatus('success');
            setMessage(data.message || 'Credentials overridden successfully.');
            // Auto redirect sequence
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (err: any) {
            setStatus('error');
            setMessage(err.response?.data?.message || 'Token verification physically rejected. Link expired or corrupt.');
        } 
    };

    return (
        <section className="py-20 bg-slate-50 min-h-screen flex items-center justify-center">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-heading font-bold text-primary mb-2">Configure Credentials</h2>
                        <p className="text-slate-600">Establish your new cryptographic password.</p>
                    </div>

                    {status === 'success' && (
                        <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 text-sm border border-green-200 font-medium">
                            {message} Redirecting you to authentication nodes...
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
                                <label className="block text-sm font-medium text-slate-700 mb-2">New Password Key</label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={status === 'loading'}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Key Integrity</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                    placeholder="••••••••"
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
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
                                {status === 'loading' ? 'Binding Keys...' : 'Sync New Password'}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}
