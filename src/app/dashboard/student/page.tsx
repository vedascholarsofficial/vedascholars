'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import { userService } from '@/services/userService';
import { jobService } from '@/services/jobService';
import { applicationService } from '@/services/applicationService';
import { aiService } from '@/services/aiService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function StudentDashboardPage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [profileCompleted, setProfileCompleted] = useState<boolean>(true);
    const [resumeScore, setResumeScore] = useState<number>(0);
    const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
    const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
    const [recentApplications, setRecentApplications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user && user.role !== 'student') {
            router.replace('/dashboard');
            return;
        }
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                const [profile, scoreData, apps, jobs] = await Promise.all([
                    userService.getUserProfile().catch(() => ({ profileCompleted: false, skills: [] })),
                    userService.getResumeScore().catch(() => ({ score: 0 })),
                    applicationService.getUserApplications().catch(() => []),
                    jobService.getAllJobs().catch(() => [])
                ]);

                setProfileCompleted(profile.profileCompleted === true);
                const currentScore = scoreData.score || 0;
                setResumeScore(currentScore);
                setRecentApplications(apps.slice(0, 5));

                const userSkills = (profile.skills || []).map((s: string) => s.toLowerCase());
                const matchedJobs = jobs.map((job: any) => {
                    const reqs = (job.requirements || []).map((r: string) => r.toLowerCase());
                    const overlap = reqs.filter((r: string) => userSkills.includes(r));
                    const matchPercentage = reqs.length > 0 ? Math.round((overlap.length / reqs.length) * 100) : 0;
                    return { ...job, matchPercentage };
                }).filter((j: any) => j.matchPercentage > 0).sort((a: any, b: any) => b.matchPercentage - a.matchPercentage).slice(0, 5);

                setRecommendedJobs(matchedJobs);

                if (currentScore > 0) {
                    aiService.sendMessage(`Give 2 short bullet point suggestions based on a resume score of ${currentScore}`)
                        .then((res: any) => {
                            const points = (res.reply || "").split('\n').filter((l: string) => l.trim().length > 5).slice(0, 2);
                            setAiSuggestions(points.length ? points : ["Expand on your technical skills.", "Ensure your profile matches industry standards."]);
                        })
                        .catch(() => {
                            setAiSuggestions(["Expand on your technical skills.", "Ensure your profile matches industry standards."]);
                        });
                } else {
                    setAiSuggestions(["Complete your profile to unlock AI insights."]);
                }
            } catch (err) {
                console.error("Dashboard failed to assemble data.", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (user && user.role === 'student') {
            fetchDashboardData();
        }
    }, [user, router]);

    if (!user || user.role !== 'student') return null;

    return (
        <section className="py-20 min-h-screen bg-slate-50">
            <div className="container mx-auto px-4 md:px-6">

                {/* Dashboard Header Bar */}
                {!profileCompleted && (
                    <div className="bg-yellow-50 border-2 border-secondary/50 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-800 shadow-sm">
                        <div>
                            <h4 className="font-bold text-lg mb-1 flex items-center gap-2">
                                <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                Action Required: Complete Your Profile
                            </h4>
                            <p className="text-slate-300 text-sm">To access all Veda Scholars opportunities, we need your education and career details.</p>
                        </div>
                        <Button variant="primary" href="/profile" className="shrink-0 bg-secondary hover:bg-[#742493] text-slate-900 border-none">
                            Complete Profile
                        </Button>
                    </div>
                )}

                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-2">
                            Welcome back, {user?.name || 'User'}
                        </h1>
                        <p className="text-slate-300">
                            Logged in as: <span className="font-medium text-slate-700 capitalize">{user?.role || 'Guest'}</span>
                        </p>
                    </div>
                </div>

                <div className="w-full">
                    <div className="flex flex-col gap-8">
                        {/* Top Stats Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Profile Summary */}
                            <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative">
                                <h3 className="text-xl font-bold mb-3 text-[#24112D]">Your Profile</h3>
                                <p className="text-slate-300 mb-6 text-sm/relaxed">
                                    This holds your personal information synced directly with the Veda Scholars parsing system.
                                </p>
                                <div className="text-sm text-slate-400 mb-4">Email: <span className="text-slate-700">{user?.email}</span></div>
                                <div className="flex items-center justify-between">
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${profileCompleted ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-300'}`}>
                                        {profileCompleted ? 'Profile Complete' : 'Profile Incomplete'}
                                    </span>
                                    <a href="/profile" className="text-sm font-medium text-[#8B2BB4] hover:underline">Edit Profile →</a>
                                </div>
                            </div>

                            {/* Resume Score */}
                            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg relative overflow-hidden group flex flex-col justify-center items-center text-center">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B2BB4]/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                                <h3 className="text-lg font-bold mb-1 text-white relative z-10">AI Resume Score</h3>
                                <div className="relative z-10 my-4 flex items-center justify-center w-24 h-24 rounded-full border-4 border-[#8B2BB4] shadow-[0_0_15px_rgba(139,43,180,0.3)]">
                                    <span className="text-3xl font-black text-white">{isLoading ? '...' : resumeScore}</span>
                                </div>
                                <p className="text-slate-400 text-sm/relaxed relative z-10">
                                    Your profile matches highly with Top Tier IT companies.
                                </p>
                                <Link href="/resume" className="text-sm font-bold text-[#8B2BB4] hover:underline relative z-10 block mt-4">
                                    Improve Score →
                                </Link>
                            </div>

                            {/* AI Suggestions */}
                            <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col">
                                <h3 className="text-xl font-bold mb-4 text-[#24112D] flex items-center gap-2">
                                    <span className="text-xl">✨</span> AI Insights
                                </h3>
                                <ul className="space-y-4 flex-grow">
                                    {isLoading ? (
                                        <p className="text-sm text-slate-300">Loading insights...</p>
                                    ) : (
                                        aiSuggestions.map((suggestion, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <div className="w-2 h-2 rounded-full bg-[#8B2BB4] mt-1.5 shrink-0"></div>
                                                <p className="text-sm text-slate-300">{suggestion.replace(/^[-*]\s*/, '')}</p>
                                            </li>
                                        ))
                                    )}
                                </ul>
                                <Link href="/vedabot" className="text-sm font-medium text-[#8B2BB4] hover:underline mt-4">
                                    Chat with VedaBot →
                                </Link>
                            </div>
                        </div>

                        {/* Bottom Lists Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-2">
                            {/* Recommended Jobs */}
                            <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-[#24112D]">Recommended Jobs</h3>
                                    <Link href="/jobs" className="text-sm text-[#8B2BB4] font-medium hover:underline">View All</Link>
                                </div>
                                <div className="space-y-4">
                                    {isLoading ? (
                                        <div className="text-sm text-slate-300 text-center py-4">Finding matches...</div>
                                    ) : recommendedJobs.length === 0 ? (
                                        <div className="text-sm text-slate-300 text-center py-4">Add skills to get matches.</div>
                                    ) : (
                                        recommendedJobs.map((job, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-[#8B2BB4]/30 transition-colors bg-slate-50/50">
                                                <div>
                                                    <h4 className="font-bold text-[#24112D]">{job.title}</h4>
                                                    <p className="text-xs text-slate-300 mt-1">{job.company}</p>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded uppercase tracking-wider mb-2">{job.matchPercentage}% Match</span>
                                                    <Link href={`/jobs/${job._id}`} className="text-xs font-bold text-[#8B2BB4] hover:underline">Apply Now</Link>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Recent Applications */}
                            <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-[#24112D]">Recent Applications</h3>
                                    <Link href="/applications" className="text-sm text-[#8B2BB4] font-medium hover:underline">View All</Link>
                                </div>
                                <div className="space-y-4">
                                    {isLoading ? (
                                        <div className="text-sm text-slate-300 text-center py-4">Loading applications...</div>
                                    ) : recentApplications.length === 0 ? (
                                        <div className="text-sm text-slate-300 text-center py-4">You haven't applied to any jobs yet.</div>
                                    ) : (
                                        recentApplications.map((app, i) => {
                                            const statusColor = app.status === 'hired' ? 'text-green-700 bg-green-100' :
                                                app.status === 'rejected' ? 'text-red-700 bg-red-100' :
                                                    'text-amber-700 bg-amber-100';
                                            return (
                                                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-[#8B2BB4]/30 transition-colors bg-slate-50/50">
                                                    <div>
                                                        <h4 className="font-bold text-[#24112D]">{app.job?.title || 'Unknown Job'}</h4>
                                                        <p className="text-xs text-slate-300 mt-1">{app.job?.company || ''}</p>
                                                    </div>
                                                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${statusColor}`}>
                                                        {app.status || 'Applied'}
                                                    </span>
                                                </div>
                                            )
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
