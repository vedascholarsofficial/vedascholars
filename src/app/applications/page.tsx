'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { applicationService } from '@/services/applicationService';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import FadeIn from '@/components/animations/FadeIn';

export default function ApplicationTrackerPage() {
    const { user } = useAuth();
    const [applications, setApplications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchApps = async () => {
             try {
                  const data = await applicationService.getUserApplications();
                  setApplications(data);
             } catch (err) {
                  console.error('Failed to parse remote applications context', err);
             } finally {
                  setIsLoading(false);
             }
        };

        if (user) fetchApps();
    }, [user]);

    // Map application enum states cleanly to Veda styles natively
    const renderStatusBadge = (status: string) => {
         const mapping: Record<string, string> = {
              'applied': 'bg-blue-100 text-blue-800',
              'reviewed': 'bg-purple-100 text-purple-800',
              'rejected': 'bg-red-100 text-red-800',
              'accepted': 'bg-green-100 text-green-800'
         };
         return (
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${mapping[status] || mapping.applied}`}>
                   {status}
              </span>
         );
    };

    return (
         <div className="bg-slate-50 min-h-screen pb-24">
             <section className="py-20 bg-[#0B1F3A] text-white">
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <FadeIn>
                        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-white">
                            My <span className="text-[#C6A94A]">Applications</span>
                        </h1>
                        <p className="text-lg text-slate-300 max-w-2xl">
                            Track your job and internship applications securely routed through the Veda recruitment system.
                        </p>
                    </FadeIn>
                </div>
            </section>

            <div className="container mx-auto px-4 md:px-6 -mt-10 relative z-20">
                 {isLoading ? (
                     <div className="bg-white p-12 text-center rounded-3xl shadow-sm border border-slate-100 text-slate-300">
                         Pulling historical telemetry data...
                     </div>
                 ) : applications.length === 0 ? (
                     <div className="bg-white p-16 text-center rounded-3xl shadow-sm border border-slate-100">
                          <h2 className="text-2xl font-bold text-[#0B1F3A] mb-4">No Applications Registered</h2>
                          <p className="text-slate-300 mb-8 max-w-md mx-auto">
                               You haven't applied to any roles yet across the Veda network ecosystem. Head to the jobs board to explore opportunities.
                          </p>
                          <Button href="/jobs" className="bg-[#C6A94A] text-[#0B1F3A] font-bold border-none hover:bg-[#bfa13a] shadow-lg">
                               Browse Jobs
                          </Button>
                     </div>
                 ) : (
                     <div className="grid grid-cols-1 gap-6">
                          {applications.map((app, index) => (
                              <FadeIn key={app._id} delay={index * 0.05}>
                                  <div className="bg-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                       <div>
                                            {/* In case job relation got severed cleanly */}
                                            <h3 className="text-xl font-bold text-[#0B1F3A] mb-1">
                                                {app.job?.title || 'Unknown Role (Deleted)'}
                                            </h3>
                                            <div className="text-slate-300 text-sm">
                                                 <span className="font-medium">{app.job?.company || 'Unknown Company'}</span> · Applied on {new Date(app.createdAt).toLocaleDateString()}
                                            </div>
                                       </div>
                                       <div className="flex items-center gap-6 w-full md:w-auto mt-4 md:mt-0">
                                            <div>{renderStatusBadge(app.status)}</div>
                                            {app.job?._id && (
                                                 <Link href={`/jobs/${app.job._id}`} className="text-sm font-medium text-[#C6A94A] hover:underline whitespace-nowrap">
                                                      View Job
                                                 </Link>
                                            )}
                                       </div>
                                  </div>
                              </FadeIn>
                          ))}
                     </div>
                 )}
            </div>
         </div>
    );
}
