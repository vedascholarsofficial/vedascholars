'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { universityService } from '@/services/universityService';
import Button from '@/components/ui/Button';
import { Pencil, Trash2, Plus, X } from 'lucide-react';

type Course = { name: string; skillsRequired: string };
type University = { _id: string; name: string; location: string; description: string; courses: { name: string; skillsRequired: string[] }[] };

const emptyCourse: Course = { name: '', skillsRequired: '' };
const emptyForm = { name: '', location: '', description: '', courses: [{ ...emptyCourse }] };

export default function AdminUniversitiesPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    const [universities, setUniversities] = useState<University[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [isSaving, setIsSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });

    useEffect(() => {
        if (!isAuthenticated) { router.push('/login'); return; }
        if (user && user.role !== 'admin') { router.push('/dashboard'); return; }
        fetchUniversities();
    }, [isAuthenticated, user]);

    const fetchUniversities = async () => {
        setIsLoading(true);
        try {
            const data = await universityService.getAllUniversities();
            setUniversities(data);
        } catch { }
        setIsLoading(false);
    };

    const openAdd = () => {
        setEditingId(null);
        setForm(emptyForm);
        setShowForm(true);
        setStatusMsg({ text: '', type: '' });
    };

    const openEdit = (uni: University) => {
        setEditingId(uni._id);
        setForm({
            name: uni.name,
            location: uni.location || '',
            description: uni.description || '',
            courses: uni.courses.length > 0
                ? uni.courses.map(c => ({ name: c.name, skillsRequired: c.skillsRequired.join(', ') }))
                : [{ ...emptyCourse }]
        });
        setShowForm(true);
        setStatusMsg({ text: '', type: '' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const closeForm = () => { setShowForm(false); setEditingId(null); setForm(emptyForm); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim()) { setStatusMsg({ text: 'University name is required.', type: 'error' }); return; }

        setIsSaving(true);
        setStatusMsg({ text: '', type: '' });

        const payload = {
            name: form.name.trim(),
            location: form.location.trim(),
            description: form.description.trim(),
            courses: form.courses
                .filter(c => c.name.trim())
                .map(c => ({
                    name: c.name.trim(),
                    skillsRequired: c.skillsRequired.split(',').map(s => s.trim()).filter(s => s)
                }))
        };

        try {
            if (editingId) {
                await universityService.updateUniversity(editingId, payload);
                setStatusMsg({ text: `"${payload.name}" updated successfully.`, type: 'success' });
            } else {
                await universityService.createUniversity(payload);
                setStatusMsg({ text: `"${payload.name}" created successfully.`, type: 'success' });
            }
            closeForm();
            fetchUniversities();
        } catch (err: any) {
            setStatusMsg({ text: err.response?.data?.message || 'Failed to save university.', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return;
        setDeletingId(id);
        try {
            await universityService.deleteUniversity(id);
            setStatusMsg({ text: `"${name}" was deleted.`, type: 'success' });
            fetchUniversities();
        } catch {
            setStatusMsg({ text: 'Failed to delete university.', type: 'error' });
        }
        setDeletingId(null);
    };

    const addCourse = () => setForm(f => ({ ...f, courses: [...f.courses, { ...emptyCourse }] }));
    const removeCourse = (i: number) => setForm(f => ({ ...f, courses: f.courses.filter((_, idx) => idx !== i) }));
    const updateCourse = (i: number, field: keyof Course, value: string) => {
        const updated = [...form.courses];
        updated[i] = { ...updated[i], [field]: value };
        setForm(f => ({ ...f, courses: updated }));
    };

    if (!isAuthenticated || user?.role !== 'admin') return null;

    return (
        <section className="py-20 min-h-screen bg-slate-50">
            <div className="container mx-auto px-4 md:px-6 max-w-5xl">

                {/* Page Header */}
                <div className="bg-[#0B1F3A] p-8 md:p-10 rounded-t-3xl text-white shadow-lg flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-1">
                    <div>
                        <h1 className="text-3xl font-heading font-bold mb-1">University Management</h1>
                        <p className="text-slate-300 text-sm">Add, edit, and remove university partners from the platform.</p>
                    </div>
                    <Button
                        onClick={openAdd}
                        className="bg-[#C6A94A] border-none text-[#0B1F3A] font-bold hover:bg-[#bfa13a] shadow-md shrink-0 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Add University
                    </Button>
                </div>

                <div className="bg-white rounded-b-3xl p-8 shadow-sm border border-slate-100 mb-8">

                    {/* Status Message */}
                    {statusMsg.text && (
                        <div className={`p-4 rounded-xl mb-6 text-sm font-medium border ${statusMsg.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-700 border-green-200'}`}>
                            {statusMsg.text}
                        </div>
                    )}

                    {/* Add / Edit Form */}
                    {showForm && (
                        <div className="mb-8 border-2 border-[#C6A94A]/30 rounded-2xl p-6 bg-amber-50/20 relative">
                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
                                <h3 className="text-xl font-bold text-[#0B1F3A]">{editingId ? 'Edit University' : 'Add New University'}</h3>
                                <button onClick={closeForm} className="text-slate-400 hover:text-slate-700 transition-colors"><X className="w-5 h-5" /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-300 mb-2">University Name *</label>
                                        <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                            placeholder="e.g. University of Oxford" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#C6A94A] outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-300 mb-2">Location</label>
                                        <input type="text" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                                            placeholder="e.g. Oxford, United Kingdom" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#C6A94A] outline-none transition-all" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-300 mb-2">Description</label>
                                    <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                        placeholder="Brief description of the university..." rows={3}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#C6A94A] outline-none transition-all resize-none" />
                                </div>

                                {/* Courses */}
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-300">Courses</label>
                                        <button type="button" onClick={addCourse} className="text-xs font-bold text-[#C6A94A] hover:underline flex items-center gap-1">
                                            <Plus className="w-3.5 h-3.5" /> Add Course
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {form.courses.map((course, i) => (
                                            <div key={i} className="grid grid-cols-12 gap-3 items-start">
                                                <div className="col-span-4">
                                                    <input type="text" value={course.name} onChange={e => updateCourse(i, 'name', e.target.value)}
                                                        placeholder="Course name" className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-[#C6A94A] outline-none" />
                                                </div>
                                                <div className="col-span-7">
                                                    <input type="text" value={course.skillsRequired} onChange={e => updateCourse(i, 'skillsRequired', e.target.value)}
                                                        placeholder="Required skills (comma-separated: python, java, ml)" className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-[#C6A94A] outline-none" />
                                                </div>
                                                <div className="col-span-1 flex justify-center pt-2">
                                                    <button type="button" onClick={() => removeCourse(i)} className="text-red-400 hover:text-red-600 transition-colors">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <Button type="button" onClick={closeForm} className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50">Cancel</Button>
                                    <Button type="submit" disabled={isSaving} className="bg-[#C6A94A] border-none text-[#0B1F3A] font-bold hover:bg-[#bfa13a] shadow-md">
                                        {isSaving ? 'Saving...' : editingId ? 'Update University' : 'Create University'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* University List */}
                    {isLoading ? (
                        <p className="text-center text-slate-400 py-12">Loading universities...</p>
                    ) : universities.length === 0 ? (
                        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-slate-300 font-medium mb-4">No universities in the system yet.</p>
                            <Button onClick={openAdd} className="bg-[#C6A94A] border-none text-[#0B1F3A] font-bold">Add Your First University</Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {universities.map(uni => (
                                <div key={uni._id} className="border border-slate-100 rounded-2xl p-6 hover:border-slate-200 hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-start gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start gap-3 mb-1">
                                            <h3 className="font-bold text-[#0B1F3A] text-lg">{uni.name}</h3>
                                            <span className="text-xs bg-slate-100 text-slate-300 px-2.5 py-1 rounded-full font-medium shrink-0 mt-0.5">{uni.courses?.length || 0} course{uni.courses?.length !== 1 ? 's' : ''}</span>
                                        </div>
                                        {uni.location && <p className="text-sm text-slate-400 mb-2">{uni.location}</p>}
                                        {uni.description && <p className="text-sm text-slate-300 line-clamp-2">{uni.description}</p>}
                                        {uni.courses?.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-3">
                                                {uni.courses.slice(0, 4).map((c, i) => (
                                                    <span key={i} className="text-[11px] bg-slate-100 text-slate-300 px-2.5 py-1 rounded-full">{c.name}</span>
                                                ))}
                                                {uni.courses.length > 4 && <span className="text-[11px] bg-amber-50 text-[#C6A94A] px-2.5 py-1 rounded-full font-bold">+{uni.courses.length - 4} more</span>}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex sm:flex-col gap-2 shrink-0">
                                        <button onClick={() => openEdit(uni)} className="flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-[#0B1F3A] border border-slate-200 hover:border-slate-300 px-4 py-2 rounded-xl transition-all">
                                            <Pencil className="w-3.5 h-3.5" /> Edit
                                        </button>
                                        <button onClick={() => handleDelete(uni._id, uni.name)} disabled={deletingId === uni._id}
                                            className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-700 border border-red-100 hover:border-red-300 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-all disabled:opacity-50">
                                            <Trash2 className="w-3.5 h-3.5" /> {deletingId === uni._id ? '...' : 'Delete'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
}
