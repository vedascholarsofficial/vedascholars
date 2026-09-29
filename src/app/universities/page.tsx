'use client';

import React, { useEffect, useState } from 'react';
import { universityService } from '@/services/universityService';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { MapPin, BookOpen, Star } from 'lucide-react';

type Course = { name: string; skillsRequired: string[] };
type University = { _id: string; name: string; location: string; description: string; courses: Course[] };
type Match = { _id: string; name: string; location: string; description: string; matchScore: number; matchedCourses: { courseName: string; matchedSkills: string[] }[] };

export default function UniversitiesPage() {
    const { isAuthenticated } = useAuth();

    const [universities, setUniversities] = useState<University[]>([]);
    const [matches, setMatches] = useState<Match[]>([]);
    const [matchMessage, setMatchMessage] = useState('');
    const [userSkills, setUserSkills] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const init = async () => {
            try {
                const data = await universityService.getAllUniversities();
                setUniversities(data);
            } catch (e) {
                console.error('Failed to fetch universities.');
            }

            if (isAuthenticated) {
                try {
                    const matchData = await universityService.matchUniversities();
                    setMatches(matchData.matches || []);
                    setUserSkills(matchData.userSkills || []);
                    if (matchData.message) setMatchMessage(matchData.message);
                } catch (e) {
                    // silent — user may not be logged in
                }
            }

            setIsLoading(false);
        };

        init();
    }, [isAuthenticated]);

    const filtered = universities.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.location?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <section className="py-20 min-h-screen bg-slate-50 flex items-center justify-center">
                <p className="text-slate-400 font-medium">Loading university network...</p>
            </section>
        );
    }

    return (
        <section className="py-20 min-h-screen bg-slate-50">
            <div className="container mx-auto px-4 md:px-6 max-w-6xl">

                {/* Page Header */}
                <div className="bg-[#0B1F3A] p-8 md:p-12 rounded-3xl text-white shadow-xl mb-8">
                    <h1 className="text-3xl md:text-4xl font-heading font-bold mb-3 text-white">University Network</h1>
                    <p className="text-slate-300 max-w-2xl">Explore our global university partners and discover programs matched to your unique skills and career goals.</p>

                    {/* Search */}
                    <div className="mt-6 max-w-lg">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search by university name or location..."
                            className="w-full px-5 py-3.5 rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-slate-400 outline-none focus:bg-white/20 focus:border-[#C6A94A] transition-all text-sm"
                        />
                    </div>
                </div>

                {/* Recommended for You (authenticated users with skills) */}
                {isAuthenticated && (
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-5">
                            <Star className="w-5 h-5 text-[#C6A94A]" />
                            <h2 className="text-xl font-bold text-[#0B1F3A]">Recommended for You</h2>
                            {userSkills.length > 0 && (
                                <span className="text-xs text-slate-400 font-medium">based on {userSkills.length} skill{userSkills.length !== 1 ? 's' : ''} in your profile</span>
                            )}
                        </div>

                        {matchMessage ? (
                            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-800 text-sm font-medium">
                                {matchMessage}{' '}
                                <Link href="/resume" className="underline font-bold text-[#C6A94A]">Open Resume Builder →</Link>
                            </div>
                        ) : matches.length === 0 ? (
                            <div className="bg-white border border-slate-100 rounded-2xl p-6 text-slate-300 text-sm">
                                No matches found yet. Add more skills to your profile to get recommendations.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {matches.map(match => (
                                    <div key={match._id} className="bg-white border-2 border-[#C6A94A]/30 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-[#C6A94A] transition-all relative">
                                        <div className="absolute top-4 right-4 bg-[#C6A94A] text-[#0B1F3A] text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
                                            {match.matchScore} match{match.matchScore !== 1 ? 'es' : ''}
                                        </div>
                                        <h3 className="font-bold text-[#0B1F3A] text-lg mb-1 pr-16">{match.name}</h3>
                                        {match.location && (
                                            <p className="text-xs text-slate-400 flex items-center gap-1 mb-3">
                                                <MapPin className="w-3 h-3" /> {match.location}
                                            </p>
                                        )}
                                        <p className="text-slate-300 text-sm mb-4 line-clamp-2">{match.description}</p>
                                        {match.matchedCourses.length > 0 && (
                                            <div className="border-t border-slate-100 pt-3">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Matched Courses</p>
                                                {match.matchedCourses.slice(0, 2).map((mc, i) => (
                                                    <div key={i} className="flex items-start gap-2 mb-1.5">
                                                        <BookOpen className="w-3.5 h-3.5 text-[#C6A94A] shrink-0 mt-0.5" />
                                                        <div>
                                                            <p className="text-xs font-semibold text-slate-700">{mc.courseName}</p>
                                                            <p className="text-[10px] text-slate-400">{mc.matchedSkills.join(', ')}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* All Universities */}
                <div>
                    <h2 className="text-xl font-bold text-[#0B1F3A] mb-5">
                        {searchQuery ? `Results for "${searchQuery}"` : 'All Partner Universities'}
                        <span className="ml-3 text-sm font-normal text-slate-400">({filtered.length} listed)</span>
                    </h2>

                    {filtered.length === 0 ? (
                        <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-400">
                            {searchQuery ? 'No universities match your search.' : 'No universities have been added yet.'}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered.map(uni => (
                                <div key={uni._id} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-200 transition-all flex flex-col">
                                    <h3 className="font-bold text-[#0B1F3A] text-lg mb-1">{uni.name}</h3>
                                    {uni.location && (
                                        <p className="text-xs text-slate-400 flex items-center gap-1 mb-3">
                                            <MapPin className="w-3 h-3" /> {uni.location}
                                        </p>
                                    )}
                                    <p className="text-slate-300 text-sm mb-4 flex-1 line-clamp-3">{uni.description || 'Global institution offering world-class programs.'}</p>

                                    {uni.courses && uni.courses.length > 0 && (
                                        <div className="border-t border-slate-100 pt-3 mt-auto">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Courses ({uni.courses.length})</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {uni.courses.slice(0, 3).map((c, i) => (
                                                    <span key={i} className="text-[11px] bg-slate-100 text-slate-300 px-2.5 py-1 rounded-full font-medium">{c.name}</span>
                                                ))}
                                                {uni.courses.length > 3 && (
                                                    <span className="text-[11px] bg-[#C6A94A]/10 text-[#C6A94A] px-2.5 py-1 rounded-full font-bold">+{uni.courses.length - 3} more</span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* CTA for non-authenticated users */}
                {!isAuthenticated && (
                    <div className="mt-10 bg-[#0B1F3A] rounded-2xl p-8 text-center text-white">
                        <h3 className="text-xl font-bold mb-2">Get Personalized Recommendations</h3>
                        <p className="text-slate-300 text-sm mb-5">Sign in and complete your profile to see universities matched to your skills.</p>
                        <Link href="/login" className="inline-block bg-[#C6A94A] text-[#0B1F3A] font-bold px-8 py-3.5 rounded-xl hover:bg-[#bfa13a] transition-colors shadow-md">
                            Sign In to Get Matches
                        </Link>
                    </div>
                )}

            </div>
        </section>
    );
}
