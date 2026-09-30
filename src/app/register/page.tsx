'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { authService } from '@/services/authService';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();
    
    // UI State 
    const [step, setStep] = useState(1); // 1 = Details, 2 = OTP
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showGoogleModal, setShowGoogleModal] = useState(false);

    // Form State — pre-fill role from /auth selection if present
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
    const [otp, setOtp] = useState('');

    useEffect(() => {
        const savedRole = localStorage.getItem('selected_role');
        if (savedRole && ['student', 'recruiter', 'university'].includes(savedRole)) {
            setFormData(prev => ({ ...prev, role: savedRole }));
        }
    }, []);

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await authService.registerUser(formData);
            setStep(2); // Transition to OTP View
        } catch (err: any) {
             // Handle 400 user already exists, etc.
             setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
             setIsLoading(false);
        }
    };

    const handleOTPSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
             await authService.verifyOTP({ email: formData.email, otp });
             localStorage.removeItem('selected_role'); // clean up
             router.push('/login?verification=success');
        } catch (err: any) {
             setError(err.response?.data?.message || 'Invalid or expired OTP.');
        } finally {
             setIsLoading(false);
        }
    };

    return (
        <section className="py-20 bg-slate-50 min-h-[90vh] flex items-center justify-center">
            <div className="container mx-auto px-4 md:px-6">
                
                <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-heading font-bold text-primary mb-2">
                           {step === 1 ? 'Create Account' : 'Verify Email'}
                        </h2>
                        <p className="text-slate-600">
                           {step === 1 ? 'Join the Veda Scholars platform.' : `Enter the 6-digit OTP sent to ${formData.email}`}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm border border-red-100">
                            {error}
                        </div>
                    )}

                    {step === 1 ? (
                        <form onSubmit={handleRegisterSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    disabled={isLoading}
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
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">I am a</label>
                                <select
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none bg-white"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    disabled={isLoading}
                                >
                                    <option value="student">Student</option>
                                    <option value="recruiter">Recruiter</option>
                                    <option value="university">University</option>
                                </select>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                fullWidth
                                className="justify-center h-12 text-lg shadow-xl shadow-primary/20 mt-2"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Processing...' : 'Register'}
                            </Button>

                             <p className="text-sm text-center text-slate-500 mt-6">
                                Already have an account? <a href="/login" className="text-secondary font-medium hover:underline">Log In</a>
                             </p>

                             <div className="mt-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-200"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-slate-500 font-medium">Or</span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={(e) => { e.preventDefault(); setShowGoogleModal(true); }}
                                    className="mt-6 w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors font-medium text-slate-700 shadow-sm outline-none focus:ring-2 focus:ring-slate-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-6 h-6">
                                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.519-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                                    </svg>
                                    Continue with Google
                                </button>
                             </div>
                        </form>
                    ) : (
                        <form onSubmit={handleOTPSubmit} className="space-y-6">
                             <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2 text-center">Security OTP</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full text-center tracking-widest text-2xl px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                    placeholder="------"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                fullWidth
                                className="justify-center h-12 text-lg shadow-xl shadow-primary/20"
                                disabled={isLoading || otp.length < 6}
                            >
                                {isLoading ? 'Verifying...' : 'Verify Email'}
                            </Button>

                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                disabled={isLoading}
                                className="w-full text-sm text-center text-slate-500 hover:text-primary transition-colors mt-4"
                            >
                                Did not receive code? Change Email
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* Google OAuth Modal Window */}
            {showGoogleModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={() => setShowGoogleModal(false)}
                    ></div>
                    <div className="relative bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full animate-fade-in text-center border border-slate-100">
                        <button 
                            onClick={() => setShowGoogleModal(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 outline-none"
                        >
                            ✕
                        </button>
                        <h3 className="text-2xl font-bold font-heading text-primary mb-2">Google Sign-Up</h3>
                        <p className="text-sm text-slate-500 mb-6">Which type of account are you looking to create via Google today?</p>
                        
                        <div className="space-y-3">
                            <button
                                onClick={() => { window.location.href = 'http://localhost:5000/api/auth/google?role=student'; }}
                                className="w-full text-left px-5 py-4 rounded-xl border-2 border-slate-100 hover:border-[#8B2BB4] hover:bg-amber-50/50 transition-all duration-200 group flex items-center gap-4"
                            >
                                <span className="text-2xl">🎓</span>
                                <div>
                                    <span className="block font-bold text-primary">Student</span>
                                    <span className="text-xs text-slate-500 group-hover:text-[#8B2BB4]">Seek Internships & Learn</span>
                                </div>
                            </button>

                            <button
                                onClick={() => { window.location.href = 'http://localhost:5000/api/auth/google?role=recruiter'; }}
                                className="w-full text-left px-5 py-4 rounded-xl border-2 border-slate-100 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all duration-200 group flex items-center gap-4"
                            >
                                <span className="text-2xl">💼</span>
                                <div>
                                    <span className="block font-bold text-primary">Recruiter</span>
                                    <span className="text-xs text-slate-500 group-hover:text-indigo-400">Post Jobs & Hire</span>
                                </div>
                            </button>

                            <button
                                onClick={() => { window.location.href = 'http://localhost:5000/api/auth/google?role=university'; }}
                                className="w-full text-left px-5 py-4 rounded-xl border-2 border-slate-100 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all duration-200 group flex items-center gap-4"
                            >
                                <span className="text-2xl">🏛️</span>
                                <div>
                                    <span className="block font-bold text-primary">University</span>
                                    <span className="text-xs text-slate-500 group-hover:text-emerald-500">Manage Campus Profiles</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
