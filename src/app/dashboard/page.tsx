'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function DashboardProxy() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Give auth context a moment to initialize or if not authed push out
        if (!isAuthenticated && user === null) {
            router.replace('/login');
            return;
        }

        if (user) {
            switch (user.role) {
                case 'admin':
                    router.replace('/dashboard/admin');
                    break;
                case 'recruiter':
                    router.replace('/dashboard/recruiter');
                    break;
                case 'university':
                    router.replace('/dashboard/university');
                    break;
                case 'student':
                default:
                    router.replace('/dashboard/student');
                    break;
            }
        }
    }, [user, isAuthenticated, router]);

    return (
        <section className="min-h-screen bg-slate-50 flex items-center justify-center">
             <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
        </section>
    );
}
