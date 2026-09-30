'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { universityService } from '@/services/universityService';
import Link from 'next/link';

export default function UniversityDashboardPage() {
    const { user } = useAuth();
    const router = useRouter();

    const [dashboardData, setDashboardData] = useState<any>(null);
    const [courses, setCourses] = useState<any[]>([]);
    const [topMatches, setTopMatches] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user && user.role !== 'university') {
             router.replace('/dashboard');
             return;
        }

        const fetchUniversityData = async () => {
             setIsLoading(true);
             try {
                 const data = await universityService.getDashboardData();
                 setDashboardData(data.university);
                 
                 const dbCourses = data.university?.courses || [];
                 const rawStudents = data.students || [];

                 const matches: any[] = [];
                 
                 const processedCourses = dbCourses.map((c: any) => {
                      const reqs = (c.skillsRequired || []).map((r: string) => r.toLowerCase());
                      let courseMatchCount = 0;
                      
                      rawStudents.forEach((st: any) => {
                          const stuSkills = (st.skills || []).map((s: string) => s.toLowerCase());
                          const overlap = reqs.filter((r: string) => stuSkills.includes(r));
                          if (overlap.length > 0 && reqs.length > 0) {
                               const matchPercentage = Math.round((overlap.length / reqs.length) * 100);
                               courseMatchCount++;
                               matches.push({
                                   id: st._id + '-' + c._id, // Add course id to ensure uniqueness in matching table
                                   studentId: st._id,
                                   studentName: st.name,
                                   matchScore: `${matchPercentage}%`,
                                   matchValue: matchPercentage,
                                   program: c.name
                               });
                          }
                      });

                      return {
                          id: c._id,
                          name: c.name,
                          applicants: courseMatchCount, // Reusing applicants field for "Matched Students" per course
                          status: c.status || 'Active'
                      };
                 });

                 setCourses(processedCourses);
                 
                 // Sort by highest match and deduplicate students visually for the Top 5
                 setTopMatches(matches.sort((a, b) => b.matchValue - a.matchValue).slice(0, 5));

             } catch (err) {
                 console.error("Failed to load university dashboard", err);
             } finally {
                 setIsLoading(false);
             }
        };

        if (user && user.role === 'university') {
             fetchUniversityData();
        }
    }, [user, router]);

    if (!user || user.role !== 'university') return null;

    return (
        <section className="py-20 min-h-screen bg-slate-50">
            <div className="container mx-auto px-4 md:px-6">

                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-2">
                            Welcome back, {user?.name || 'University Rep'}
                        </h1>
                        <p className="text-slate-300">
                            Logged in as: <span className="font-medium text-slate-700 capitalize">University Partner</span>
                        </p>
                    </div>
                </div>

                <div className="w-full mt-4 space-y-8">
                    {/* Top Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* University Profile */}
                        <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative">
                            <h3 className="text-xl font-bold mb-3 text-[#24112D]">University Profile</h3>
                            <p className="text-slate-300 mb-6 text-sm/relaxed">
                                Manage your institution's public details and accreditation information displayed to students.
                            </p>
                            <div className="text-sm text-slate-400 mb-4">Contact Email: <span className="text-slate-700">{user?.email}</span></div>
                            <div className="text-sm text-slate-400 mb-4 border-t border-slate-100 pt-4">Assigned Entity: <span className="font-bold text-[#24112D]">{isLoading ? 'Loading...' : dashboardData?.name}</span></div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-700">
                                    Verified Institution
                                </span>
                                <a href="/profile" className="text-sm font-medium text-[#8B2BB4] hover:underline">Edit Hub Profile →</a>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-center">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B2BB4]/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                            <h3 className="text-xl font-bold mb-6 text-white relative z-10">Engagement Overview</h3>
                            <div className="grid grid-cols-2 gap-4 relative z-10">
                                <div>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Active Courses</p>
                                    <p className="text-3xl font-black text-white">{isLoading ? '-' : courses.length}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Matched</p>
                                    <p className="text-3xl font-black text-[#8B2BB4]">{isLoading ? '-' : courses.reduce((a: any, b: any) => a + b.applicants, 0)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Courses Offered */}
                        <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-[#24112D]">Courses Offered</h3>
                                </div>
                                <Button href="/courses/create" className="bg-[#8B2BB4] text-white hover:bg-[#742493] border-none font-bold text-sm h-10 px-4 shadow-sm shrink-0">
                                    + Add Course
                                </Button>
                            </div>
                            
                            <div className="space-y-4">
                                {isLoading ? (
                                    <div className="text-center py-6 text-sm text-slate-300">Loading university payload...</div>
                                ) : courses.length === 0 ? (
                                    <div className="text-center py-6 text-sm text-slate-300">No courses listed yet.</div>
                                ) : courses.map((course: any) => (
                                    <div key={course.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-[#8B2BB4]/30 transition-colors bg-slate-50/50 gap-4">
                                        <div>
                                            <h4 className="font-bold text-[#24112D]">{course.name}</h4>
                                            <p className="text-xs text-slate-300 mt-1">{course.applicants} Matched Students</p>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 ${
                                                course.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-700'
                                            }`}>
                                                {course.status}
                                            </span>
                                            <Link href={`/courses/${course.id}/edit`} className="text-xs font-bold text-[#8B2BB4] hover:underline whitespace-nowrap">
                                                Edit Course
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Students Matched */}
                        <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-[#24112D]">Top Students Matched</h3>
                                <Link href="/students" className="text-sm text-[#8B2BB4] font-medium hover:underline">View Prospect Pool</Link>
                            </div>
                            
                            <div className="space-y-4">
                                {isLoading ? (
                                    <div className="text-center py-6 text-sm text-slate-300">Running matchmaking algorithm...</div>
                                ) : topMatches.length === 0 ? (
                                    <div className="text-center py-6 text-sm text-slate-300">Wait for students to build profiles.</div>
                                ) : topMatches.map((match: any) => (
                                    <div key={match.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-[#8B2BB4]/30 transition-colors bg-slate-50/50 gap-4">
                                        <div>
                                            <h4 className="font-bold text-[#24112D]">{match.studentName}</h4>
                                            <p className="text-xs text-slate-300 mt-1">Matched: {match.program}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded uppercase tracking-wider mb-1 text-center min-w-[70px]">
                                                    {match.matchScore} Match
                                                </span>
                                            </div>
                                            <Link href={`/students/${match.studentId}`} className="text-xs font-bold text-[#8B2BB4] hover:underline whitespace-nowrap">
                                                Review
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
