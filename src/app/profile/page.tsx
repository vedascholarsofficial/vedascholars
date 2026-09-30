'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import { userService } from '@/services/userService';

const emptyEducation = { degree: '', institution: '', year: '' };
const emptyExperience = { company: '', role: '', duration: '' };

export default function ProfilePage() {
    const { user } = useAuth();
    
    // Default struct
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: '',
        skills: '',
        resume: '',
        education: [{ ...emptyEducation }],
        experience: [{ ...emptyExperience }]
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });

    useEffect(() => {
        const fetchProfile = async () => {
             try {
                 const data = await userService.getUserProfile();
                 setFormData({
                      name: data.name || '',
                      phone: data.phone || '',
                      skills: data.skills ? data.skills.join(', ') : '',
                      resume: data.resume || '',
                      education: data.education?.length > 0 ? data.education : [{ ...emptyEducation }],
                      experience: data.experience?.length > 0 ? data.experience : [{ ...emptyExperience }],
                 });
             } catch (err) {
                 setStatusMsg({ text: 'Unable to pull complete profile limits locally.', type: 'error' });
             } finally {
                 setIsLoading(false);
             }
        };

        if (user) fetchProfile();
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleArrayChange = (group: 'education' | 'experience', index: number, field: string, value: string) => {
        const newData = [...formData[group]];
        (newData[index] as any)[field] = value;
        setFormData({ ...formData, [group]: newData });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setStatusMsg({ text: '', type: '' });

        try {
            const payload = {
                 ...formData,
                 skills: formData.skills.split(',').map((s) => s.trim()).filter((s) => s)
            };
            
            await userService.updateUserProfile(payload);
            setStatusMsg({ text: 'Your Veda Scholar profile has successfully updated!', type: 'success' });
            setTimeout(() => setStatusMsg({ text: '', type: '' }), 4000);
        } catch (err: any) {
            setStatusMsg({ text: err.response?.data?.message || 'Error executing sequence save.', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
         return (
             <section className="py-20 min-h-screen bg-slate-50 flex items-center justify-center">
                 <p className="text-slate-500 font-medium">Authenticating & Fetching Profile...</p>
             </section>
         );
    }

    return (
        <section className="py-20 min-h-screen bg-slate-50">
            <div className="container mx-auto px-4 md:px-6">

                 <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 mb-8">
                     <div>
                         <h1 className="text-3xl font-heading font-bold text-primary mb-2">My Profile Dashboard</h1>
                         <p className="text-slate-500">A completed profile verifies you across Veda's recruiter integrations.</p>
                     </div>
                 </div>

                 {statusMsg.text && (
                     <div className={`p-4 rounded-xl mb-6 text-sm font-medium border ${statusMsg.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-700 border-green-200'}`}>
                         {statusMsg.text}
                     </div>
                 )}

                 <form onSubmit={handleSubmit} className="space-y-8">
                    
                     <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                         <h3 className="text-xl font-bold mb-6 text-slate-800">Primary Details</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                   <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                                   <input type="text" name="name" value={formData.name} onChange={handleChange} required
                                       className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                              </div>
                              <div>
                                   <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                                   <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 ..."
                                       className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                              </div>
                              <div className="md:col-span-2">
                                   <label className="block text-sm font-medium text-slate-700 mb-2">Key Skills (Comma separated)</label>
                                   <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="Team Leadership, Operations, Frontend"
                                       className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                              </div>
                              <div className="md:col-span-2">
                                   <label className="block text-sm font-medium text-slate-700 mb-2">Cloud Resume Link (URL)</label>
                                   <input type="url" name="resume" value={formData.resume} onChange={handleChange} placeholder="https://drive.google.com/..."
                                       className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                              </div>
                         </div>
                     </div>

                     <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                         <h3 className="text-xl font-bold mb-6 text-slate-800">Primary Education</h3>
                         {formData.education.map((edu, idx) => (
                             <div key={`edu-${idx}`} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                 <div>
                                     <label className="block text-sm font-medium text-slate-700 mb-2">Degree Level</label>
                                     <input type="text" value={edu.degree} onChange={(e) => handleArrayChange('education', idx, 'degree', e.target.value)} placeholder="E.g., Masters"
                                         className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary transition-all outline-none" />
                                 </div>
                                 <div>
                                     <label className="block text-sm font-medium text-slate-700 mb-2">Institution Name</label>
                                     <input type="text" value={edu.institution} onChange={(e) => handleArrayChange('education', idx, 'institution', e.target.value)} placeholder="Oxford University"
                                         className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary transition-all outline-none" />
                                 </div>
                                 <div>
                                     <label className="block text-sm font-medium text-slate-700 mb-2">Graduation Year</label>
                                     <input type="text" value={edu.year} onChange={(e) => handleArrayChange('education', idx, 'year', e.target.value)} placeholder="2025"
                                         className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary transition-all outline-none" />
                                 </div>
                             </div>
                         ))}
                     </div>

                     <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                         <h3 className="text-xl font-bold mb-6 text-slate-800">Recent Experience</h3>
                         {formData.experience.map((exp, idx) => (
                             <div key={`exp-${idx}`} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                 <div>
                                     <label className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
                                     <input type="text" value={exp.company} onChange={(e) => handleArrayChange('experience', idx, 'company', e.target.value)} placeholder="Google"
                                         className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary transition-all outline-none" />
                                 </div>
                                 <div>
                                     <label className="block text-sm font-medium text-slate-700 mb-2">Role / Title</label>
                                     <input type="text" value={exp.role} onChange={(e) => handleArrayChange('experience', idx, 'role', e.target.value)} placeholder="Full Stack Developer"
                                         className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary transition-all outline-none" />
                                 </div>
                                 <div>
                                     <label className="block text-sm font-medium text-slate-700 mb-2">Duration / Timeline</label>
                                     <input type="text" value={exp.duration} onChange={(e) => handleArrayChange('experience', idx, 'duration', e.target.value)} placeholder="2021 - 2024"
                                         className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary transition-all outline-none" />
                                 </div>
                             </div>
                         ))}
                     </div>

                     <div className="flex justify-end pt-4">
                         <Button type="submit" variant="primary" className="bg-[#8B2BB4] border-none text-slate-900 font-bold hover:bg-[#742493] h-14 px-10 shadow-xl" disabled={isSaving}>
                             {isSaving ? 'Processing Securely...' : 'Lock My Profile'}
                         </Button>
                     </div>

                 </form>

            </div>
        </section>
    );
}
