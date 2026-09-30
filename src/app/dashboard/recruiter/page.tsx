'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import { jobService } from '@/services/jobService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RecruiterDashboardPage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [recruiterJobs, setRecruiterJobs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user && user.role !== 'recruiter') {
             router.replace('/dashboard');
        }
        const fetchRecruiterData = async () => {
             setIsLoading(true);
             try {
                  const data = await jobService.getRecruiterJobs();
                  setRecruiterJobs(data);
             } catch (err) {
                  console.error("Dashboard failed to fetch recruiter telemetries.");
             } finally {
                  setIsLoading(false);
             }
        };

        if (user && user.role === 'recruiter') {
             fetchRecruiterData();
        }
    }, [user, router]);

    if (!user || user.role !== 'recruiter') return null;

    return (
        <section className="py-20 min-h-screen bg-slate-50">
            <div className="container mx-auto px-4 md:px-6">

                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-2">
                            Welcome back, {user?.name || 'Recruiter'}
                        </h1>
                        <p className="text-slate-500">
                            Logged in as: <span className="font-medium text-slate-700 capitalize">{user?.role || 'Guest'}</span>
                        </p>
                    </div>
                </div>

                <div className="w-full">
                     {/* RECRUITER SPECIFIC "MY JOBS" CONTAINER BOUNDS */}
                     <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow mt-4">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                              <div>
                                  <h3 className="text-xl font-bold text-[#24112D]">My Posted Jobs</h3>
                                  <p className="text-sm text-slate-500">Track and manage jobs you've forwarded to our admins for approval.</p>
                              </div>
                              <Button href="/jobs/create" className="bg-[#8B2BB4] text-white hover:bg-[#742493] border-none font-bold text-sm h-12 px-6 shadow-md shrink-0">
                                   + Post a New Job
                              </Button>
                          </div>
                          
                          {isLoading ? (
                               <div className="text-center py-6 bg-slate-50 rounded-xl border border-slate-100">
                                   <p className="text-slate-500 text-sm font-medium">Loading your job postings...</p>
                               </div>
                          ) : recruiterJobs.length === 0 ? (
                               <div className="text-center py-6 bg-slate-50 rounded-xl border border-slate-100">
                                   <p className="text-slate-500 text-sm font-medium">You haven't posted any jobs to the network yet.</p>
                               </div>
                          ) : (
                               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                   {recruiterJobs.map(job => (
                                        <div key={job._id} className="border border-slate-100 p-5 rounded-xl hover:border-[#8B2BB4]/40 transition-colors flex flex-col h-full bg-slate-50/50">
                                             <div className="flex justify-between items-start mb-3">
                                                 <p className="font-bold text-[#24112D] line-clamp-1">{job.title}</p>
                                                 <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 ${
                                                      job.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                      job.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                      'bg-amber-100 text-amber-700'
                                                 }`}>
                                                     {job.status}
                                                 </span>
                                             </div>
                                             <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
                                                 <p className="text-slate-500 text-sm">{job.company}</p>
                                                 <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                                                     <span className="text-sm">👥</span>
                                                     {job.applicantCount || 0} applicants
                                                 </div>
                                             </div>
                                             
                                             <div className="mt-auto flex justify-end">
                                                 <Link href={`/jobs/${job._id}`} className="text-[#8B2BB4] text-sm hover:underline font-bold">
                                                     View Posting →
                                                 </Link>
                                             </div>
                                        </div>
                                   ))}
                               </div>
                          )}
                     </div>
                </div>
            </div>
        </section>
    );
}
