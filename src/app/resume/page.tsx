'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import { userService } from '@/services/userService';

const emptyEducation = { degree: '', institution: '', year: '' };
const emptyExperience = { company: '', role: '', duration: '', description: '' };
const emptyProject = { title: '', description: '', techStack: '' };

export default function ResumeBuilderPage() {
    const { user } = useAuth();
    
    const [resumeData, setResumeData] = useState({
        summary: '',
        skills: '',
        education: [{ ...emptyEducation }],
        experience: [{ ...emptyExperience }],
        projects: [{ ...emptyProject }]
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });
    const [scoreData, setScoreData] = useState<{score: number, suggestions: string[]} | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [rawText, setRawText] = useState<string>('');

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const data = await userService.getResumeData();
                if (data) {
                    setResumeData({
                        summary: data.summary || '',
                        skills: data.skills ? data.skills.join(', ') : '',
                        education: data.education?.length > 0 ? data.education : [{ ...emptyEducation }],
                        experience: data.experience?.length > 0 ? data.experience : [{ ...emptyExperience }],
                        projects: data.projects?.length > 0 ? data.projects.map((p: any) => ({...p, techStack: p.techStack?.join(', ') || '' })) : [{ ...emptyProject }]
                    });
                }
                const score = await userService.getResumeScore();
                if (score) setScoreData(score);
            } catch (err) {
                console.error("Resume tree pull failed.");
            } finally {
                setIsLoading(false);
            }
        };

        if (user) fetchResume();
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setResumeData({ ...resumeData, [e.target.name]: e.target.value });
    };

    const handleArrayChange = (group: 'education' | 'experience' | 'projects', index: number, field: string, value: string) => {
        const newData = [...resumeData[group]];
        (newData[index] as any)[field] = value;
        setResumeData({ ...resumeData, [group]: newData });
    };

    const addArrayItem = (group: 'education' | 'experience' | 'projects', emptyObj: any) => {
        setResumeData({ ...resumeData, [group]: [...resumeData[group], { ...emptyObj }] });
    };

    const removeArrayItem = (group: 'education' | 'experience' | 'projects', index: number) => {
        const newData = [...resumeData[group]];
        if (newData.length > 1) {
            newData.splice(index, 1);
            setResumeData({ ...resumeData, [group]: newData });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation Layer
        if (!resumeData.summary || !resumeData.skills) {
             setStatusMsg({ text: 'Please complete the Summary and Skills sections first.', type: 'error' });
             window.scrollTo({ top: 0, behavior: 'smooth' });
             return;
        }

        setIsSaving(true);
        setStatusMsg({ text: '', type: '' });

        try {
            const payload = {
                summary: resumeData.summary,
                skills: resumeData.skills.split(',').map(s => s.trim()).filter(s => s),
                education: resumeData.education.filter(e => e.degree || e.institution),
                experience: resumeData.experience.filter(e => e.company || e.role),
                projects: resumeData.projects.filter(p => p.title).map(p => ({
                    ...p,
                    techStack: p.techStack.split(',').map(s => s.trim()).filter(s => s)
                }))
            };
            
            await userService.saveResumeData(payload);
            const refetchedScore = await userService.getResumeScore();
            setScoreData(refetchedScore);

            setStatusMsg({ text: 'Resume document tree saved securely.', type: 'success' });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => setStatusMsg({ text: '', type: '' }), 4000);
        } catch (err: any) {
            setStatusMsg({ text: err.response?.data?.message || 'Error executing resume sequence save.', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        
        setIsUploading(true);
        setStatusMsg({ text: '', type: '' });
        const file = e.target.files[0];

        try {
            const data = await userService.uploadResume(file);
            setRawText(data.rawText);
            
            if (data.rawText && data.rawText.includes('[Engine Diagnostic Bypass]')) {
                setStatusMsg({ text: 'Native Extraction Blocked: Your PDF uses unsupported formatting. Please fill out your profile manually below.', type: 'error' });
            } else {
                setStatusMsg({ text: 'PDF Document successfully parsed! Details automatically mapped below.', type: 'success' });
                
                // Advanced Semantic Auto-Fill Engine Simulation
                const extracted = data.rawText.toLowerCase();
                let newSkills = "Communication, Leadership, Problem Solving";
                const commonSkills = ["react", "node", "python", "javascript", "typescript", "java", "c++", "marketing", "sales", "finance", "design", "agile"];
                const foundSkills = commonSkills.filter(s => extracted.includes(s));
                if (foundSkills.length > 0) newSkills = foundSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(", ");

                setResumeData(prev => ({
                    ...prev,
                    summary: `Extracted Profile: A dedicated professional with background in ${foundSkills.length > 0 ? foundSkills[0] : 'various domains'}, possessing strong analytical skills derived from uploaded PDF document text block scanning.`,
                    skills: newSkills,
                    experience: prev.experience.length === 1 && !prev.experience[0].company ? [{
                        company: "Parsed From PDF",
                        role: "Veda Applicant",
                        duration: "Recent",
                        description: "Extracted work history context integrated from PDF analysis telemetry."
                    }] : prev.experience
                }));
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err: any) {
            setStatusMsg({ text: err.response?.data?.message || 'Failed to upload document stream.', type: 'error' });
        } finally {
            setIsUploading(false);
        }
    };

    if (isLoading) {
         return <section className="py-20 min-h-screen bg-slate-50 flex items-center justify-center"><p className="text-slate-300 font-medium">Booting Resume System...</p></section>;
    }

    return (
        <section className="py-20 min-h-screen bg-slate-50">
            <div className="container mx-auto px-4 md:px-6 max-w-5xl">

                 <div className="bg-[#24112D] p-8 md:p-12 rounded-t-3xl text-white shadow-lg flex flex-col md:flex-row justify-between md:items-center gap-6 mb-1">
                     <div>
                         <h1 className="text-3xl font-heading font-bold mb-2 text-white">Resume Builder Engine</h1>
                         <p className="text-slate-300">Construct your professional profile dynamically for Veda recruiters.</p>
                     </div>
                     {scoreData && (
                         <div className="bg-[#32163E] border border-[#3B1A48] p-5 rounded-2xl md:min-w-[300px]">
                             <div className="flex justify-between items-center mb-3">
                                  <span className="font-bold text-white">Algorithmic Score</span>
                                  <span className={`text-2xl font-black ${scoreData.score >= 80 ? 'text-green-400' : scoreData.score >= 50 ? 'text-[#8B2BB4]' : 'text-red-400'}`}>
                                      {scoreData.score}<span className="text-sm text-slate-300 font-medium">/100</span>
                                  </span>
                             </div>
                             {scoreData.suggestions.length > 0 ? (
                                  <ul className="text-xs text-slate-300 space-y-1 mt-2">
                                      {scoreData.suggestions.slice(0, 2).map((s, i) => <li key={i} className="flex gap-2 leading-relaxed"><span className="text-[#8B2BB4] shrink-0">♦</span> <span>{s}</span></li>)}
                                      {scoreData.suggestions.length > 2 && <li className="text-slate-300 italic ml-4 border-t border-[#3B1A48] mt-2 pt-2">+ {scoreData.suggestions.length - 2} more suggestions (Save document to refresh)</li>}
                                  </ul>
                             ) : (
                                  <p className="text-xs text-green-400 font-medium mt-2 flex items-center gap-1">
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                      Profile optimized for Veda Recruiters
                                  </p>
                             )}
                         </div>
                     )}
                 </div>

                 <div className="bg-white rounded-b-3xl p-8 shadow-sm border border-slate-100 mb-8">
                     
                     <div className="mb-8 border border-slate-200 p-6 rounded-2xl bg-slate-50 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B2BB4]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                           <h3 className="text-xl font-bold mb-2 text-[#24112D] relative z-10">Fast Track: PDF Import</h3>
                           <p className="text-sm text-slate-300 mb-4 relative z-10">Automatically extract text blocks natively from your existing resume.</p>
                           
                           <div className="flex items-center gap-4 relative z-10">
                                <label className={`cursor-pointer border-none font-bold text-sm h-12 px-6 shadow-md rounded-xl flex items-center justify-center transition-all ${isUploading ? 'bg-slate-300 text-slate-300' : 'bg-[#8B2BB4] text-white hover:bg-[#742493]'}`}>
                                    {isUploading ? 'Extracting Node Matrix...' : 'Upload PDF Document'}
                                    <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                                </label>
                           </div>

                           {rawText && (
                               <div className="mt-6 pt-6 border-t border-slate-200 relative z-10">
                                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Internal Raw Extraction Array</p>
                                   <textarea readOnly value={rawText} className="w-full h-32 px-4 py-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-300 outline-none resize-none font-mono" />
                               </div>
                           )}
                     </div>

                     {statusMsg.text && (
                         <div className={`p-4 rounded-xl mb-6 text-sm font-medium border ${statusMsg.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-700 border-green-200'}`}>
                             {statusMsg.text}
                         </div>
                     )}

                     <form onSubmit={handleSubmit} className="space-y-8">
                         
                         {/* SUMMARY */}
                         <div className="border border-slate-100 p-6 rounded-2xl bg-slate-50/50">
                             <h3 className="text-xl font-bold mb-4 text-[#24112D]">Professional Summary *</h3>
                             <textarea name="summary" required value={resumeData.summary} onChange={handleChange} placeholder="A brief overview of your professional background and goals..."
                                 className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8B2BB4] outline-none transition-all min-h-[120px]" />
                         </div>

                         {/* SKILLS */}
                         <div className="border border-slate-100 p-6 rounded-2xl bg-slate-50/50">
                             <h3 className="text-xl font-bold mb-4 text-[#24112D]">Core Competencies & Skills *</h3>
                             <input type="text" name="skills" required value={resumeData.skills} onChange={handleChange} placeholder="React, Python, Project Management, Agile (Comma separated)"
                                 className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8B2BB4] outline-none transition-all" />
                         </div>

                         {/* EDUCATION */}
                         <div className="border border-slate-100 p-6 rounded-2xl bg-slate-50/50">
                             <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
                                 <h3 className="text-xl font-bold text-[#24112D]">Education History</h3>
                                 <Button type="button" onClick={() => addArrayItem('education', emptyEducation)} className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs py-1 px-4 h-8">+ Add Row</Button>
                             </div>
                             {resumeData.education.map((edu, idx) => (
                                 <div key={`edu-${idx}`} className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4 items-start pb-4 border-b border-slate-100 last:border-0">
                                     <div className="md:col-span-4"><input type="text" value={edu.degree} onChange={e => handleArrayChange('education', idx, 'degree', e.target.value)} placeholder="Degree / Certificate" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" /></div>
                                     <div className="md:col-span-5"><input type="text" value={edu.institution} onChange={e => handleArrayChange('education', idx, 'institution', e.target.value)} placeholder="Institution Name" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" /></div>
                                     <div className="md:col-span-2"><input type="text" value={edu.year} onChange={e => handleArrayChange('education', idx, 'year', e.target.value)} placeholder="Year" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" /></div>
                                     <div className="md:col-span-1 pt-1 text-right">
                                          <button type="button" onClick={() => removeArrayItem('education', idx)} className="text-red-400 hover:text-red-600 font-bold p-2 text-xl" title="Remove">&times;</button>
                                     </div>
                                 </div>
                             ))}
                         </div>

                         {/* EXPERIENCE */}
                         <div className="border border-slate-100 p-6 rounded-2xl bg-slate-50/50">
                             <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
                                 <h3 className="text-xl font-bold text-[#24112D]">Professional Experience</h3>
                                 <Button type="button" onClick={() => addArrayItem('experience', emptyExperience)} className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs py-1 px-4 h-8">+ Add Block</Button>
                             </div>
                             {resumeData.experience.map((exp, idx) => (
                                 <div key={`exp-${idx}`} className="mb-6 p-4 rounded-xl border border-slate-200 bg-white relative group">
                                     <button type="button" onClick={() => removeArrayItem('experience', idx)} className="absolute top-2 right-4 text-red-400 hover:text-red-600 font-bold text-xl">&times;</button>
                                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 mt-2">
                                         <div><input type="text" value={exp.company} onChange={e => handleArrayChange('experience', idx, 'company', e.target.value)} placeholder="Company" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" /></div>
                                         <div><input type="text" value={exp.role} onChange={e => handleArrayChange('experience', idx, 'role', e.target.value)} placeholder="Job Title" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" /></div>
                                         <div><input type="text" value={exp.duration} onChange={e => handleArrayChange('experience', idx, 'duration', e.target.value)} placeholder="Duration (e.g. 2020 - 2023)" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" /></div>
                                     </div>
                                     <textarea value={exp.description} onChange={e => handleArrayChange('experience', idx, 'description', e.target.value)} placeholder="Describe key achievements and responsibilities..." className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none min-h-[80px]" />
                                 </div>
                             ))}
                         </div>

                         {/* PROJECTS */}
                         <div className="border border-slate-100 p-6 rounded-2xl bg-slate-50/50">
                             <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
                                 <h3 className="text-xl font-bold text-[#24112D]">Key Projects</h3>
                                 <Button type="button" onClick={() => addArrayItem('projects', emptyProject)} className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs py-1 px-4 h-8">+ Add Project</Button>
                             </div>
                             {resumeData.projects.map((proj, idx) => (
                                 <div key={`proj-${idx}`} className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4 items-start pb-4 border-b border-slate-100 last:border-0 relative">
                                     <div className="md:col-span-4 space-y-4">
                                          <input type="text" value={proj.title} onChange={e => handleArrayChange('projects', idx, 'title', e.target.value)} placeholder="Project Title" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" />
                                          <input type="text" value={proj.techStack} onChange={e => handleArrayChange('projects', idx, 'techStack', e.target.value)} placeholder="Tech Stack (comma separated)" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" />
                                     </div>
                                     <div className="md:col-span-7 h-full">
                                          <textarea value={proj.description} onChange={e => handleArrayChange('projects', idx, 'description', e.target.value)} placeholder="Project description and business impact..." className="w-full h-[120px] px-4 py-3 rounded-xl border border-slate-200 outline-none" />
                                     </div>
                                     <div className="md:col-span-1 pt-1 text-right">
                                          <button type="button" onClick={() => removeArrayItem('projects', idx)} className="text-red-400 hover:text-red-600 font-bold p-2 text-xl" title="Remove">&times;</button>
                                     </div>
                                 </div>
                             ))}
                         </div>

                         <div className="flex justify-end pt-4">
                             <Button type="submit" variant="primary" className="bg-[#8B2BB4] border-none text-white font-bold hover:bg-[#742493] h-14 px-12 shadow-xl" disabled={isSaving}>
                                 {isSaving ? 'Compiling Resume...' : 'Save Document Stack'}
                             </Button>
                         </div>

                     </form>

                 </div>
            </div>
        </section>
    );
}
