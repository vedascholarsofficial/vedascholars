'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { jobService } from '@/services/jobService';
import Button from '@/components/ui/Button';

export default function CreateJobPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    
    const [newJob, setNewJob] = useState({ 
        title: '', 
        company: '', 
        location: '', 
        type: 'full-time', 
        description: '', 
        requirements: '',
        salary: ''
    });
    
    const [isCreating, setIsCreating] = useState(false);
    const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });

    // Security intercept
    if (isAuthenticated && user?.role !== 'recruiter' && user?.role !== 'admin') {
         if (typeof window !== 'undefined') router.push('/jobs');
         return null;
    }

    const handleCreateJob = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        setStatusMsg({ text: '', type: '' });
        
        try {
            const payload = { 
                ...newJob, 
                requirements: newJob.requirements.split(',').map(s => s.trim()).filter(s => s) 
            };
            await jobService.createJob(payload);
            setStatusMsg({ text: 'Job successfully submitted! It is currently [Pending] awaiting Admin approval.', type: 'success' });
            setNewJob({ title: '', company: '', location: '', type: 'full-time', description: '', requirements: '', salary: '' });
        } catch (error: any) {
            setStatusMsg({ text: error.response?.data?.message || 'Failed to submit job parameters.', type: 'error' });
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <section className="py-24 min-h-screen bg-slate-50">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                
                <div className="bg-[#24112D] p-8 md:p-12 rounded-t-3xl text-white shadow-lg">
                     <h1 className="text-3xl md:text-4xl font-heading font-bold mb-3">Post a New Role</h1>
                     <p className="text-slate-300">Submit a job listing securely to the Veda network. All posts require Admin moderation.</p>
                </div>

                <div className="bg-white p-8 md:p-12 rounded-b-3xl shadow-sm border border-slate-100">
                     {statusMsg.text && (
                         <div className={`p-4 rounded-xl mb-8 text-sm font-medium border ${statusMsg.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-700 border-green-200'}`}>
                             {statusMsg.text}
                         </div>
                     )}

                     <form onSubmit={handleCreateJob} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         
                         <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-slate-700 mb-2">Job Title</label>
                              <input type="text" placeholder="Senior Architect" required value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8B2BB4] outline-none transition-all" />
                         </div>

                         <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
                              <input type="text" placeholder="Veda Corp" required value={newJob.company} onChange={e => setNewJob({...newJob, company: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8B2BB4] outline-none transition-all" />
                         </div>

                         <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                              <input type="text" placeholder="Dubai, UAE" required value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8B2BB4] outline-none transition-all" />
                         </div>

                         <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">Job Type</label>
                              <select value={newJob.type} onChange={e => setNewJob({...newJob, type: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8B2BB4] outline-none transition-all bg-white">
                                  <option value="full-time">Full-Time</option>
                                  <option value="part-time">Part-Time</option>
                                  <option value="internship">Internship</option>
                              </select>
                         </div>

                         <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">Salary Estimate</label>
                              <input type="text" placeholder="$80k - $120k" value={newJob.salary} onChange={e => setNewJob({...newJob, salary: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8B2BB4] outline-none transition-all" />
                         </div>

                         <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-slate-700 mb-2">Requirements (Comma separated)</label>
                              <input type="text" placeholder="React, Node.js, 3+ Years XP" required value={newJob.requirements} onChange={e => setNewJob({...newJob, requirements: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8B2BB4] outline-none transition-all" />
                         </div>

                         <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-slate-700 mb-2">Complete Description</label>
                              <textarea placeholder="Describe the role responsibilities..." required value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8B2BB4] outline-none transition-all min-h-[150px]" />
                         </div>

                         <div className="md:col-span-2 flex justify-end gap-4 mt-4 pt-6 border-t border-slate-100">
                             <Button type="button" variant="outline" onClick={() => router.push('/dashboard')}>Cancel</Button>
                             <Button type="submit" variant="primary" disabled={isCreating} className="bg-[#8B2BB4] text-white border-none font-bold hover:bg-[#742493] disabled:opacity-60">
                                 {isCreating ? 'Submitting for Review...' : 'Submit Job Listing'}
                             </Button>
                         </div>
                     </form>
                </div>

            </div>
        </section>
    );
}
