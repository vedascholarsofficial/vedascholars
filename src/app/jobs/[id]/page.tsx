'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { jobService } from '@/services/jobService';
import Button from '@/components/ui/Button';
import FadeIn from '@/components/animations/FadeIn';
import { MapPin, Briefcase, Calendar, CheckCircle, Navigation, Banknote } from 'lucide-react';
import Link from 'next/link';

export default function JobDetailsPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    
    const [job, setJob] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isApplying, setIsApplying] = useState(false);
    const [applyStatus, setApplyStatus] = useState({ text: '', type: '' });

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const data = await jobService.getJobById(id);
                setJob(data);
            } catch (err) {
                console.error('Job fetch error', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const handleApply = async () => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        setIsApplying(true);
        setApplyStatus({ text: '', type: '' });

        try {
            await jobService.applyToJob(id);
            setApplyStatus({ text: 'Application submitted successfully! Your resume will be reviewed shorty.', type: 'success' });
        } catch (error: any) {
             const message = error.response?.data?.message || 'Error executing application dispatch.';
             setApplyStatus({ text: message, type: 'error' });
        } finally {
            setIsApplying(false);
        }
    };

    // If the error message natively hints they applied, disable it visually via state
    const alreadyApplied = applyStatus.text.toLowerCase().includes('already applied') || applyStatus.type === 'success';

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-300">Loading Job Details...</div>;
    }

    if (!job) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center">
                 <h2 className="text-2xl font-bold text-[#24112D] mb-4">Job Not Found</h2>
                 <Link href="/jobs" className="text-[#8B2BB4] hover:underline">Return to job board</Link>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen pb-24">
             {/* Header Banner Context */}
             <div className="bg-[#24112D] pt-28 pb-16 text-white text-center rounded-b-[40px] shadow-lg">
                 <div className="container mx-auto px-4 md:px-6">
                     <span className="inline-block py-1 px-3 rounded-full bg-[#8B2BB4]/20 border border-[#8B2BB4]/40 text-[#8B2BB4] text-xs font-bold uppercase tracking-wider mb-6">
                         {job.type || 'Full-Time'}
                     </span>
                     <h1 className="text-3xl md:text-5xl font-heading font-bold mb-4">{job.title}</h1>
                     <div className="flex items-center justify-center gap-6 text-slate-300 font-medium flex-wrap">
                          <span className="flex items-center gap-2"><Briefcase className="w-5 h-5" /> {job.company}</span>
                          {job.location && <span className="flex items-center gap-2"><MapPin className="w-5 h-5" /> {job.location}</span>}
                          {job.salary && <span className="flex items-center gap-2"><Banknote className="w-5 h-5" /> {job.salary}</span>}
                          <span className="flex items-center gap-2"><Calendar className="w-5 h-5" /> {new Date(job.createdAt).toLocaleDateString()}</span>
                     </div>
                 </div>
             </div>

             <div className="container mx-auto px-4 md:px-6 mt-10">
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                      
                      {/* Main Job Body */}
                      <div className="lg:col-span-2 space-y-8">
                           <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100">
                               <h2 className="text-2xl font-bold text-[#24112D] mb-6 border-b border-slate-100 pb-4">Job Description</h2>
                               <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                                   {job.description || 'No description provided for this role.'}
                               </div>

                               {job.requirements && job.requirements.length > 0 && (
                                   <div className="mt-10">
                                       <h3 className="text-xl font-bold text-[#24112D] mb-4">Role Requirements</h3>
                                       <div className="flex flex-wrap gap-2">
                                           {job.requirements.map((req: string, index: number) => (
                                               <span key={index} className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium">
                                                   {req}
                                               </span>
                                           ))}
                                       </div>
                                   </div>
                               )}
                           </div>
                      </div>

                      {/* Sticky Application Drawer */}
                      <div className="lg:col-span-1">
                           <div className="sticky top-28 bg-white p-8 rounded-3xl shadow-xl shadow-[#24112D]/5 border border-slate-100 text-center">
                                <h3 className="text-xl font-bold text-[#24112D] mb-2">Apply for this Role</h3>
                                <p className="text-sm text-slate-300 mb-8 border-b border-slate-100 pb-6">
                                    Our platform automatically bridges your verified profile securely to the recruiter parameters bound to {job.company}.
                                </p>
                                
                                {applyStatus.text && (
                                    <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${applyStatus.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                                        {applyStatus.type === 'success' && <CheckCircle className="inline w-5 h-5 mr-1" />}
                                        {applyStatus.text}
                                    </div>
                                )}

                                <Button 
                                    onClick={handleApply} 
                                    disabled={isApplying || alreadyApplied}
                                    className={`w-full justify-center h-14 text-lg transition-all font-bold tracking-wide shadow-lg border-none ${alreadyApplied ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-[#8B2BB4] text-white hover:bg-[#742493] disabled:opacity-60'}`}
                                >
                                    {isApplying ? 'Submitting...' : alreadyApplied ? 'Application Sent' : 'Apply Now'}
                                </Button>
                                
                                <Link href="/jobs" className="flex items-center justify-center gap-2 mt-6 text-sm text-slate-300 hover:text-[#24112D]">
                                    <Navigation className="w-4 h-4 rotate-[-90deg]" /> Return to Listings
                                </Link>
                           </div>
                      </div>

                 </div>
             </div>
        </div>
    );
}
