'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

const roles = [
    {
        key: 'student',
        label: 'Student',
        description: 'Explore universities, build your resume, apply for jobs, and get AI career advice.',
        icon: '🎓',
        color: 'hover:border-[#8B2BB4] hover:bg-amber-50/30',
        badge: 'Most Popular'
    },
    {
        key: 'recruiter',
        label: 'Recruiter',
        description: 'Post job listings, discover top talent, and manage your job openings.',
        icon: '💼',
        color: 'hover:border-indigo-300 hover:bg-indigo-50/30',
        badge: ''
    },
    {
        key: 'university',
        label: 'University',
        description: 'Connect with prospective students, manage your profile, and list academic programs.',
        icon: '🏛️',
        color: 'hover:border-emerald-300 hover:bg-emerald-50/30',
        badge: ''
    }
];

export default function AuthPage() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    // If already logged in, skip role selection entirely
    useEffect(() => {
        if (isAuthenticated) {
            router.replace('/dashboard');
        }
    }, [isAuthenticated, router]);

    const handleRoleSelect = (role: string) => {
        localStorage.setItem('selected_role', role);
        router.push('/register');
    };

    if (isAuthenticated) return null;

    return (
        <section className="py-20 min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="container mx-auto px-4 md:px-6 max-w-2xl">

                {/* Header Card */}
                <div className="bg-[#24112D] rounded-t-3xl px-8 py-10 text-white text-center shadow-xl">
                    <h1 className="text-3xl md:text-4xl font-heading font-bold mb-3">
                        Welcome to Veda Scholars
                    </h1>
                    <p className="text-slate-300 text-lg">
                        Choose how you want to continue
                    </p>
                </div>

                {/* Role Cards */}
                <div className="bg-white rounded-b-3xl p-8 shadow-sm border border-slate-100 space-y-4">
                    {roles.map(role => (
                        <button
                            key={role.key}
                            onClick={() => handleRoleSelect(role.key)}
                            className={`w-full text-left border-2 border-slate-100 rounded-2xl p-6 transition-all duration-200 group ${role.color} cursor-pointer`}
                        >
                            <div className="flex items-start gap-4">
                                <span className="text-4xl">{role.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="text-lg font-bold text-[#24112D] group-hover:text-[#24112D]">
                                            {role.label}
                                        </span>
                                        {role.badge && (
                                            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#8B2BB4] text-white px-2.5 py-0.5 rounded-full">
                                                {role.badge}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-slate-300 text-sm leading-relaxed">{role.description}</p>
                                </div>
                                <span className="text-slate-300 group-hover:text-[#8B2BB4] text-2xl transition-colors shrink-0 mt-1">→</span>
                            </div>
                        </button>
                    ))}

                    <div className="pt-4 border-t border-slate-100 text-center">
                        <p className="text-slate-300 text-sm">
                            Already have an account?{' '}
                            <Link href="/login" className="text-[#8B2BB4] font-semibold hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
}
