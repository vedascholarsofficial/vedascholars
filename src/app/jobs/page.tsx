'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { jobService } from '@/services/jobService';
import Button from '@/components/ui/Button';
import FadeIn from '@/components/animations/FadeIn';
import { MapPin, Briefcase, Clock } from 'lucide-react';

export default function JobsListingPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
         const fetchJobs = async () => {
             setIsLoading(true);
             try {
                 const data = await jobService.getAllJobs();
                 setJobs(data);
             } catch (err) {
                 console.error('Error fetching jobs', err);
             } finally {
                 setIsLoading(false);
             }
         };
         fetchJobs();
    }, []);

    return (
        <div className="bg-slate-50 min-h-screen pb-24">
             {/* Header Section mimicking /jobs/apply */}
             <section className="relative py-20 bg-[#24112D] text-white overflow-hidden">
                <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
                    <FadeIn>
                        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-white leading-tight">
                            Explore <span className="text-[#8B2BB4]">Global Opportunities</span>
                        </h1>
                        <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
                            Discover career defining roles across the network.
                        </p>
                    </FadeIn>
                </div>
            </section>

            <div className="container mx-auto px-4 md:px-6 -mt-10 relative z-20">
                 {/* Jobs List */}
                 {isLoading ? (
                     <div className="text-center py-12 text-slate-300 bg-white rounded-2xl shadow-sm border border-slate-100">Loading open roles...</div>
                 ) : jobs.length === 0 ? (
                     <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-300">
                         No jobs are actively posted right now.
                     </div>
                 ) : (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                         {jobs.map((job, idx) => (
                              <FadeIn key={job._id} delay={idx * 0.05}>
                                  <Link href={`/jobs/${job._id}`} className="block h-full">
                                      <article className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-[#8B2BB4]/40 hover:shadow-lg transition-all duration-300 h-full flex flex-col cursor-pointer group">
                                          <div className="flex items-center justify-between mb-4">
                                              <span className="bg-blue-50 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                                  {job.type || 'Full-Time'}
                                              </span>
                                              {job.salary && (
                                                   <span className="text-sm font-bold text-[#8B2BB4]">{job.salary}</span>
                                              )}
                                          </div>
                                          <h3 className="text-xl font-bold text-[#24112D] mb-2 group-hover:text-[#8B2BB4] transition-colors">
                                              {job.title}
                                          </h3>
                                          <div className="flex items-center gap-2 text-slate-300 font-medium mb-4">
                                              <Briefcase className="w-4 h-4 text-slate-400" /> {job.company}
                                          </div>
                                          
                                          <div className="mt-auto space-y-2 text-sm text-slate-300 border-t border-slate-100 pt-4">
                                              {job.location && (
                                                   <div className="flex items-center gap-2">
                                                       <MapPin className="w-4 h-4 text-[#8B2BB4]" /> {job.location}
                                                   </div>
                                              )}
                                              <div className="flex items-center gap-2">
                                                  <Clock className="w-4 h-4 text-[#8B2BB4]" /> Posted {new Date(job.createdAt).toLocaleDateString()}
                                              </div>
                                          </div>
                                      </article>
                                  </Link>
                              </FadeIn>
                         ))}
                     </div>
                 )}
            </div>
        </div>
    );
}
