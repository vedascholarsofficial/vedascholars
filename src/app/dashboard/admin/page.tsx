'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { analyticsService } from '@/services/analyticsService';
import { adminService } from '@/services/adminService';
import { jobService } from '@/services/jobService';
import { universityService } from '@/services/universityService';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

type TabType = 'analytics' | 'users' | 'jobs' | 'universities';

export default function AdminDashboardPage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    
    // Core State
    const [activeTab, setActiveTab] = useState<TabType>('analytics');
    const [loading, setLoading] = useState(false);
    
    // Data States
    const [adminStats, setAdminStats] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [jobs, setJobs] = useState<any[]>([]);
    const [universities, setUniversities] = useState<any[]>([]);

    // Modal States
    const [isJobModalOpen, setIsJobModalOpen] = useState(false);
    const [isUniModalOpen, setIsUniModalOpen] = useState(false);
    const [currentJob, setCurrentJob] = useState<any>(null);
    const [currentUni, setCurrentUni] = useState<any>(null);

    // Form States
    const initialJobForm = { title: '', company: '', location: '', type: 'Full-time', description: '', requirements: '', salary: '', status: 'approved' };
    const [jobForm, setJobForm] = useState({ ...initialJobForm });

    const initialUniForm = { name: '', location: '', description: '', courses: '' };
    const [uniForm, setUniForm] = useState({ ...initialUniForm });

    useEffect(() => {
        if (user && user.role !== 'admin') {
            router.replace('/dashboard');
        }
    }, [user, router]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const data = await analyticsService.getAdminStats();
            setAdminStats(data);
        } catch(e) { console.error(e) }
        setLoading(false);
    }
    
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await adminService.getAllUsers();
            setUsers(data);
        } catch(e) { console.error(e) }
        setLoading(false);
    }

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const data = await jobService.getAdminJobs();
            setJobs(data);
        } catch(e) { console.error(e) }
        setLoading(false);
    }

    const fetchUniversities = async () => {
        setLoading(true);
        try {
            const data = await universityService.getAllUniversities();
            setUniversities(data);
        } catch(e) { console.error(e) }
        setLoading(false);
    }

    useEffect(() => {
        if (!user || user.role !== 'admin') return;
        
        if (activeTab === 'analytics') fetchAnalytics();
        else if (activeTab === 'users') fetchUsers();
        else if (activeTab === 'jobs') fetchJobs();
        else if (activeTab === 'universities') fetchUniversities();
    }, [activeTab, user]);

    // --- USER ACTIONS ---
    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            await adminService.updateUserRole(userId, newRole);
            fetchUsers();
        } catch(err) { alert('Action failed.'); }
    };
    const handleDeleteUser = async (u: any) => {
        if(!window.confirm(`Permanently eradicate node "${u.name}"?`)) return;
        try { await adminService.deleteUser(u._id); fetchUsers(); } catch(err) { alert('Deletion failed.'); }
    };

    // --- JOB ACTIONS ---
    const handleJobStatus = async (id: string, action: 'approve'|'reject') => {
        try {
            if (action === 'approve') await jobService.approveJob(id);
            else await jobService.rejectJob(id);
            fetchJobs();
        } catch(err) { alert('Failed updating Job status.'); }
    };
    const handleDeleteJob = async (j: any) => {
        if(!window.confirm(`Delete job "${j.title}"?`)) return;
        try { await jobService.deleteJob(j._id); fetchJobs(); } catch(err) { alert('Deletion failed.'); }
    };
    
    const openJobModal = (job: any = null) => {
        setCurrentJob(job);
        if (job) {
             setJobForm({
                 title: job.title || '',
                 company: job.company || '',
                 location: job.location || '',
                 type: job.type || 'Full-time',
                 description: job.description || '',
                 requirements: job.requirements ? job.requirements.join(', ') : '',
                 salary: job.salary || '',
                 status: job.status || 'approved'
             });
        } else {
             setJobForm({ ...initialJobForm });
        }
        setIsJobModalOpen(true);
    };

    const submitJobForm = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...jobForm,
                requirements: jobForm.requirements.split(',').map(s => s.trim()).filter(Boolean)
            };
            if (currentJob) await jobService.updateJob(currentJob._id, payload);
            else await jobService.createJob(payload);
            
            setIsJobModalOpen(false);
            fetchJobs();
        } catch(err) { alert('Action failed. Verify connectivity.'); }
    };

    // --- UNI ACTIONS ---
    const handleDeleteUniversity = async (uni: any) => {
        if(!window.confirm(`Dismantle University "${uni.name}"?`)) return;
        try { await universityService.deleteUniversity(uni._id); fetchUniversities(); } catch(err) { alert('Dismantle failed.'); }
    };

    const openUniModal = (uni: any = null) => {
        setCurrentUni(uni);
        if (uni) {
             setUniForm({
                 name: uni.name || '',
                 location: uni.location || '',
                 description: uni.description || '',
                 // Extract courses via simple comma map for UI simplicity
                 courses: uni.courses ? uni.courses.map((c: any) => c.title).join(', ') : ''
             });
        } else {
             setUniForm({ ...initialUniForm });
        }
        setIsUniModalOpen(true);
    };

    const submitUniForm = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Reconstruct minimal schema for mapped courses
            const courseArray = uniForm.courses.split(',').map(c => ({
                 title: c.trim(),
                 description: "Admin assigned logic module.",
                 skillsRequired: ["General"]
            })).filter(c => c.title);

            const payload = { ...uniForm, courses: courseArray };
            
            if (currentUni) await universityService.updateUniversity(currentUni._id, payload);
            else await universityService.createUniversity(payload);
            
            setIsUniModalOpen(false);
            fetchUniversities();
        } catch(err) { alert('Action failed. Verify connectivity.'); }
    };


    if (!user || user.role !== 'admin') return <section className="py-20 min-h-screen bg-slate-50 flex items-center justify-center"><p className="text-[#8B2BB4] font-bold">Verifying Clearance...</p></section>;

    return (
        <section className="py-20 min-h-screen bg-slate-50 relative">
            
            {/* INLINE MODAL OVERLAYS */}
            {isJobModalOpen && (
                <div className="fixed inset-0 bg-[#24112D]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                             <h2 className="text-2xl font-bold text-[#24112D]">{currentJob ? 'Edit Architecture Job' : 'Deploy Global Job'}</h2>
                             <button onClick={() => setIsJobModalOpen(false)} className="text-slate-400 hover:text-red-500 font-bold text-xl">&times;</button>
                        </div>
                        <form onSubmit={submitJobForm} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input required placeholder="Job Title" value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} className="p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                                <input required placeholder="Company Name" value={jobForm.company} onChange={e => setJobForm({...jobForm, company: e.target.value})} className="p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                                <input required placeholder="Location" value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})} className="p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                                <select value={jobForm.type} onChange={e => setJobForm({...jobForm, type: e.target.value})} className="p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-700">
                                     <option value="Full-time">Full-time</option><option value="Part-time">Part-time</option><option value="Contract">Contract</option><option value="Internship">Internship</option>
                                </select>
                            </div>
                            <textarea required placeholder="Job Description Block" rows={4} value={jobForm.description} onChange={e => setJobForm({...jobForm, description: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                            <input required placeholder="Requirements (comma separated)" value={jobForm.requirements} onChange={e => setJobForm({...jobForm, requirements: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                            <div className="grid grid-cols-2 gap-4">
                                 <input placeholder="Salary Logic (e.g. $80k - $120k)" value={jobForm.salary} onChange={e => setJobForm({...jobForm, salary: e.target.value})} className="p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                                 <select value={jobForm.status} onChange={e => setJobForm({...jobForm, status: e.target.value})} className="p-3 bg-slate-50 border border-[2px] border-[#8B2BB4] rounded-xl outline-none text-[#24112D] font-bold uppercase text-xs">
                                     <option value="approved">Status: Approved</option>
                                     <option value="pending">Status: Pending</option>
                                     <option value="rejected">Status: Rejected</option>
                                 </select>
                            </div>
                            <Button type="submit" variant="primary" className="bg-[#24112D] w-full mt-4 h-12 text-white border-0 shadow-lg">Submit Override</Button>
                        </form>
                    </div>
                </div>
            )}

            {isUniModalOpen && (
                <div className="fixed inset-0 bg-[#24112D]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                             <h2 className="text-2xl font-bold text-[#24112D]">{currentUni ? 'Edit University Block' : 'Bind New University Node'}</h2>
                             <button onClick={() => setIsUniModalOpen(false)} className="text-slate-400 hover:text-red-500 font-bold text-xl">&times;</button>
                        </div>
                        <form onSubmit={submitUniForm} className="space-y-4">
                            <input required placeholder="Institution Legal Name" value={uniForm.name} onChange={e => setUniForm({...uniForm, name: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                            <input required placeholder="Regional Location" value={uniForm.location} onChange={e => setUniForm({...uniForm, location: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                            <textarea required placeholder="Brief Institution Description" rows={3} value={uniForm.description} onChange={e => setUniForm({...uniForm, description: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                            <div className="p-4 bg-slate-100/50 rounded-xl border border-slate-200">
                                <label className="text-xs font-bold uppercase tracking-wider text-[#24112D] block mb-2">Simulated Course Injection</label>
                                <textarea placeholder="Course Titles (comma separated)" rows={3} value={uniForm.courses} onChange={e => setUniForm({...uniForm, courses: e.target.value})} className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none text-sm" />
                            </div>
                            <Button type="submit" variant="primary" className="bg-[#8B2BB4] w-full mt-4 h-12 text-white font-bold border-0 shadow-lg hover:bg-[#742493] transition-all">Bind Structure Array</Button>
                        </form>
                    </div>
                </div>
            )}


            <div className="container mx-auto px-4 md:px-6 relative z-10">

                {/* Header Banner */}
                <div className="bg-[#24112D] rounded-3xl p-8 md:p-12 shadow-lg mb-8 relative border-b-4 border-[#8B2BB4]">
                    <div className="relative z-10">
                        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2 text-white">
                            Control Panel, {user?.name || 'Director'}
                        </h1>
                        <p className="text-slate-300">
                            Clearance Level: <span className="font-bold text-[#8B2BB4] tracking-wider uppercase">System Administrator</span>
                        </p>
                    </div>
                </div>

                {/* Nav Tabs */}
                <div className="flex gap-4 mb-8 overflow-x-auto pb-2 custom-scrollbar">
                    {(['analytics', 'users', 'jobs', 'universities'] as TabType[]).map(tab => (
                        <button 
                            key={tab} 
                            onClick={() => setActiveTab(tab)} 
                            className={`px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest text-sm transition-all whitespace-nowrap ${activeTab === tab ? 'bg-[#24112D] text-white shadow-xl translate-y-[-2px] border-b-2 border-[#8B2BB4]' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-slate-800 shadow-sm'}`}
                        >
                            {tab} Terminal
                        </button>
                    ))}
                </div>

                <div className="w-full mt-4 min-h-[500px]">
                    {/* TAB: ANALYTICS */}
                    {activeTab === 'analytics' && (
                        <div className="space-y-6 fade-in">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {[
                                    { label: 'Network Users', value: adminStats?.totalUsers, color: 'bg-indigo-600', icon: '👤' },
                                    { label: 'Active Jobs', value: adminStats?.totalJobs, color: 'bg-[#24112D]', icon: '💼' },
                                    { label: 'Applications Routed', value: adminStats?.totalApplications, color: 'bg-[#8B2BB4]', icon: '📋' },
                                ].map(card => (
                                    <div key={card.label} className={`${card.color} text-white p-8 rounded-2xl shadow-lg flex items-center gap-5 translate-y-0 hover:-translate-y-1 transition-transform`}>
                                        <span className="text-4xl">{card.icon}</span>
                                        <div>
                                            <p className="text-white/70 text-sm font-medium uppercase tracking-wider">{card.label}</p>
                                            <p className="text-4xl font-black mt-1">{loading ? '—' : (card.value ?? 0)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TAB: USERS */}
                    {activeTab === 'users' && (
                        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden fade-in">
                            <div className="bg-slate-50 p-6 border-b border-slate-200 flex justify-between items-center">
                                <h3 className="font-bold text-xl text-[#24112D]">User Registry</h3>
                                <span className="bg-[#24112D] text-white text-xs font-bold px-3 py-1 rounded-full">{users.length} Nodes</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-[#24112D] text-white">
                                        <tr>
                                            <th className="p-5 font-bold whitespace-nowrap">Identity</th>
                                            <th className="p-5 font-bold whitespace-nowrap">Network Email</th>
                                            <th className="p-5 font-bold whitespace-nowrap text-center">Security Clearance</th>
                                            <th className="p-5 font-bold whitespace-nowrap text-right">Overrides</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((u, i) => (
                                            <tr key={u._id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-slate-100 transition-colors border-b border-slate-100`}>
                                                <td className="p-5 font-bold text-slate-800">{u.name}</td>
                                                <td className="p-5 text-slate-500 text-sm font-medium">{u.email}</td>
                                                <td className="p-5 text-center">
                                                    <select 
                                                        value={u.role} 
                                                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                                        className="text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg border-2 border-slate-200 bg-white text-[#24112D] outline-none hover:border-[#8B2BB4] cursor-pointer"
                                                    >
                                                        <option value="student">Student</option>
                                                        <option value="recruiter">Recruiter</option>
                                                        <option value="university">University</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                </td>
                                                <td className="p-5 text-right">
                                                    <button onClick={() => handleDeleteUser(u)} className="text-red-500 bg-red-50 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm">PURGE</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* TAB: JOBS */}
                    {activeTab === 'jobs' && (
                        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden fade-in">
                            <div className="bg-slate-50 p-6 border-b border-slate-200 flex justify-between items-center">
                                <h3 className="font-bold text-xl text-[#24112D]">Job Gateway Routing</h3>
                                <button onClick={() => openJobModal()} className="bg-[#24112D] text-white hover:bg-[#32163E] px-4 py-2 rounded-lg text-sm font-bold shadow-md transition-colors">+ Deploy Master Job</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-[#24112D] text-white">
                                        <tr>
                                            <th className="p-5 font-bold">Role Title</th>
                                            <th className="p-5 font-bold">Corporation</th>
                                            <th className="p-5 font-bold text-center">Global Status</th>
                                            <th className="p-5 font-bold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {jobs.map((j, i) => (
                                            <tr key={j._id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'} border-b border-slate-100 hover:bg-slate-100 transition-colors`}>
                                                <td className="p-5 font-bold text-[#24112D]">{j.title}</td>
                                                <td className="p-5 text-slate-500 font-medium text-sm">{j.company}</td>
                                                <td className="p-5 text-center">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md border ${j.status === 'approved' ? 'bg-green-100 text-green-700 border-green-200' : j.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                                                        {j.status}
                                                    </span>
                                                </td>
                                                <td className="p-5 flex justify-end gap-2">
                                                    <button onClick={() => openJobModal(j)} className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-2 rounded-lg font-bold shadow-sm transition-colors">Edit</button>
                                                    {j.status !== 'approved' && <button onClick={() => handleJobStatus(j._id, 'approve')} className="text-xs bg-[#24112D] hover:bg-[#32163E] text-white px-3 py-2 rounded-lg font-bold shadow-sm transition-colors">Approve</button>}
                                                    {j.status !== 'rejected' && <button onClick={() => handleJobStatus(j._id, 'reject')} className="text-xs border-2 border-amber-500 text-amber-600 hover:bg-amber-50 px-3 py-2 rounded-lg font-bold transition-colors">Reject</button>}
                                                    <button onClick={() => handleDeleteJob(j)} className="text-red-500 bg-red-50 hover:bg-red-500 hover:text-white px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-sm">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* TAB: UNIVERSITIES */}
                    {activeTab === 'universities' && (
                        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden fade-in">
                            <div className="bg-slate-50 p-6 border-b border-slate-200 flex justify-between items-center">
                                <h3 className="font-bold text-xl text-[#24112D]">University Integrations</h3>
                                <button onClick={() => openUniModal()} className="bg-[#8B2BB4] text-white hover:bg-[#742493] px-4 py-2 rounded-lg text-sm font-bold shadow-md transition-colors">+ Bind Network Node</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-[#24112D] text-white">
                                        <tr>
                                            <th className="p-5 font-bold">Institution Name</th>
                                            <th className="p-5 font-bold">Regional Location</th>
                                            <th className="p-5 font-bold text-center">Course Pipelines</th>
                                            <th className="p-5 font-bold text-right">Eradicate</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {universities.map((u, i) => (
                                            <tr key={u._id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'} border-b border-slate-100 hover:bg-slate-100 transition-colors`}>
                                                <td className="p-5 font-bold text-[#24112D]">{u.name}</td>
                                                <td className="p-5 text-slate-500 text-sm font-medium">{u.location}</td>
                                                <td className="p-5 text-center text-sm font-bold text-indigo-600">{u.courses?.length || 0}</td>
                                                <td className="p-5 flex justify-end gap-2">
                                                    <button onClick={() => openUniModal(u)} className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-2 rounded-lg font-bold shadow-sm transition-colors">Edit</button>
                                                    <button onClick={() => handleDeleteUniversity(u)} className="text-red-500 bg-red-50 hover:bg-red-500 hover:text-white px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-sm">
                                                         Wipe Node 
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </section>
    );
}
