'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';

export default function SettingsPage() {
    const { user } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });

    // Mock preferences
    const [preferences, setPreferences] = useState({
        emailAlerts: true,
        jobRecommendations: true,
        twoFactorAuth: false,
    });

    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const handleToggle = (key: keyof typeof preferences) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSaveSettings = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setStatusMsg({ text: '', type: '' });

        // Simulate save
        setTimeout(() => {
            if (passwords.new && passwords.new !== passwords.confirm) {
                setStatusMsg({ text: 'New passwords do not match.', type: 'error' });
                setIsSaving(false);
                return;
            }
            setStatusMsg({ text: 'Your account settings have been successfully updated.', type: 'success' });
            setPasswords({ current: '', new: '', confirm: '' });
            setIsSaving(false);
            setTimeout(() => setStatusMsg({ text: '', type: '' }), 4000);
        }, 800);
    };

    if (!user) {
        return (
            <section className="py-20 min-h-screen bg-slate-50 flex items-center justify-center">
                <p className="text-slate-500 font-medium">Authenticating...</p>
            </section>
        );
    }

    return (
        <section className="py-20 min-h-screen bg-slate-50">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">

                 <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 mb-8 mt-4">
                     <div>
                         <h1 className="text-3xl font-heading font-bold text-primary mb-2">Account Settings</h1>
                         <p className="text-slate-500">Manage your alerts, security preferences, and system parameters.</p>
                     </div>
                 </div>

                 {statusMsg.text && (
                     <div className={`p-4 rounded-xl mb-6 text-sm font-medium border ${statusMsg.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-700 border-green-200'}`}>
                         {statusMsg.text}
                     </div>
                 )}

                 <form onSubmit={handleSaveSettings} className="space-y-8">
                     
                     {/* Notification Preferences */}
                     <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                         <h3 className="text-xl font-bold mb-6 text-slate-800 border-b border-slate-100 pb-4">Notifications</h3>
                         
                         <div className="space-y-6">
                             <div className="flex items-center justify-between">
                                 <div>
                                     <h4 className="font-bold text-[#0B1F3A]">Email Alerts</h4>
                                     <p className="text-sm text-slate-500">Receive emails about application updates and invites.</p>
                                 </div>
                                 <button type="button" onClick={() => handleToggle('emailAlerts')} className={`w-12 h-6 rounded-full transition-colors relative ${preferences.emailAlerts ? 'bg-[#C6A94A]' : 'bg-slate-300'}`}>
                                     <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${preferences.emailAlerts ? 'translate-x-6' : 'translate-x-0'}`}></span>
                                 </button>
                             </div>

                             <div className="flex items-center justify-between">
                                 <div>
                                     <h4 className="font-bold text-[#0B1F3A]">Job Recommendations</h4>
                                     <p className="text-sm text-slate-500">Get weekly notifications about matches tailored to your profile.</p>
                                 </div>
                                 <button type="button" onClick={() => handleToggle('jobRecommendations')} className={`w-12 h-6 rounded-full transition-colors relative ${preferences.jobRecommendations ? 'bg-[#C6A94A]' : 'bg-slate-300'}`}>
                                     <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${preferences.jobRecommendations ? 'translate-x-6' : 'translate-x-0'}`}></span>
                                 </button>
                             </div>
                         </div>
                     </div>

                     {/* Security Settings */}
                     <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                         <h3 className="text-xl font-bold mb-6 text-slate-800 border-b border-slate-100 pb-4">Security</h3>
                         
                         <div className="grid grid-cols-1 gap-6 max-w-lg mb-8">
                             <div>
                                 <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                                 <input type="password" name="current" value={passwords.current} onChange={handlePasswordChange} placeholder="••••••••"
                                     className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                             </div>
                             <div>
                                 <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                                 <input type="password" name="new" value={passwords.new} onChange={handlePasswordChange} placeholder="••••••••"
                                     className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                             </div>
                             <div>
                                 <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                                 <input type="password" name="confirm" value={passwords.confirm} onChange={handlePasswordChange} placeholder="••••••••"
                                     className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                             </div>
                         </div>

                         <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                             <div>
                                 <h4 className="font-bold text-[#0B1F3A]">Two-Factor Authentication</h4>
                                 <p className="text-sm text-slate-500">Add an extra layer of security to your account.</p>
                             </div>
                             <button type="button" onClick={() => handleToggle('twoFactorAuth')} className={`w-12 h-6 rounded-full transition-colors relative ${preferences.twoFactorAuth ? 'bg-green-600' : 'bg-slate-300'}`}>
                                 <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${preferences.twoFactorAuth ? 'translate-x-6' : 'translate-x-0'}`}></span>
                             </button>
                         </div>
                     </div>

                     {/* Danger Zone */}
                     <div className="bg-red-50 border border-red-200 p-8 rounded-2xl shadow-sm mt-8">
                         <h3 className="text-xl font-bold mb-2 text-red-800">Danger Zone</h3>
                         <p className="text-sm text-red-600 mb-6">Irreversible actions regarding your active Veda Scholars account.</p>
                         
                         <div className="flex items-center justify-between">
                             <div>
                                 <h4 className="font-bold text-red-900">Deactivate Account</h4>
                                 <p className="text-sm text-red-700/80">Soft-delete your profile and hide your data from recruiters temporarily.</p>
                             </div>
                             <Button type="button" variant="outline" className="border-red-300 text-red-700 hover:bg-red-100 hover:text-red-800 whitespace-nowrap px-6">
                                 Deactivate
                             </Button>
                         </div>
                     </div>

                     {/* Save Action */}
                     <div className="flex justify-end pt-4 pb-12">
                         <Button type="submit" variant="primary" className="bg-[#C6A94A] border-none text-slate-900 font-bold hover:bg-[#bfa13a] h-14 px-10 shadow-xl" disabled={isSaving}>
                             {isSaving ? 'Applying Settings...' : 'Save Settings'}
                         </Button>
                     </div>

                 </form>
            </div>
        </section>
    );
}
