'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import Button from '../ui/Button';
import { Menu, X, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { notificationService } from '@/services/notificationService';

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated, user, logout } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [showBell, setShowBell] = useState(false);
    const bellRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    useEffect(() => {
        if (!isAuthenticated) return;
        const fetchNotifications = async () => {
            try {
                const data = await notificationService.getNotifications();
                setNotifications(data);
            } catch (e) { /* silent */ }
        };
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [isAuthenticated]);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
                setShowBell(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleMarkRead = async (id: string) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (e) { /* silent */ }
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const publicNavLinks = [
        { name: 'Home', href: '/' },
        { name: 'About Us', href: '/about' },
        { name: 'Services', href: '/services' },
        { name: 'Students', href: '/students' },
        { name: 'Apply for Jobs', href: '/jobs/apply' },
        { name: 'Partner With Us', href: '/partner-with-us' },
        { name: 'Contact', href: '/contact' },
    ];

    const studentNavLinks = [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Jobs', href: '/jobs' },
        { name: 'Resume', href: '/resume' },
        { name: 'Applications', href: '/applications' },
        { name: 'Universities', href: '/universities' },
        { name: 'VedaBot', href: '/vedabot' },
    ];

    const recruiterNavLinks = [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'My Jobs', href: '/jobs' },
        { name: 'Applications', href: '/applications' },
    ];

    const adminNavLinks = [
        { name: 'Dashboard', href: '/dashboard' } // Minimal access
    ];

    const universityNavLinks = [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Courses', href: '/courses' },
        { name: 'Students', href: '/students' }
    ];

    let currentNavLinks = publicNavLinks;
    if (isAuthenticated && user) {
        if (user.role === 'admin') currentNavLinks = adminNavLinks;
        else if (user.role === 'recruiter') currentNavLinks = recruiterNavLinks;
        else if (user.role === 'university') currentNavLinks = universityNavLinks;
        else currentNavLinks = studentNavLinks;
    }

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'
                }`}
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    {/* Brand Identity Block */}
                    <Link href="/" className="flex items-center gap-3 z-50 group">
                        {/* Logo Icon */}
                        <div className="relative h-10 w-10 md:h-11 md:w-11 rounded-lg overflow-hidden shadow-sm transition-transform duration-300 ease-in-out group-hover:scale-105">
                            <Image
                                src="/images/veda-logo.png"
                                alt="Veda Scholars Logo"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        {/* Brand Text */}
                        <div className="flex flex-col justify-center">
                            <span className="font-heading font-bold text-xl md:text-2xl tracking-wide leading-none text-primary transition-colors duration-300">
                                Veda Scholars
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {currentNavLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`relative text-sm font-medium transition-colors duration-300 group/nav
                                        ${isActive ? 'text-[#B8860B]' : isScrolled ? 'text-primary hover:text-[#B8860B]' : 'text-primary hover:text-[#B8860B]'}
                                    `}
                                >
                                    {link.name}
                                    <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-[#B8860B] transform origin-left transition-transform duration-300 ease-out
                                        ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover/nav:scale-x-100'}
                                    `} />
                                </Link>
                            );
                        })}
                        {/* Notification Bell - shown only when authenticated */}
                        {isAuthenticated && (
                            <div className="relative" ref={bellRef}>
                                <button
                                    onClick={() => setShowBell(prev => !prev)}
                                    className="relative p-2 text-primary hover:text-[#B8860B] transition-colors"
                                    aria-label="Notifications"
                                >
                                    <Bell className="w-5 h-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 bg-[#B8860B] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </button>

                                {showBell && (
                                    <div className="absolute right-0 top-full mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                                        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                                            <p className="font-bold text-[#0B1F3A] text-sm">Notifications</p>
                                            {unreadCount > 0 && <span className="text-xs text-[#B8860B] font-semibold">{unreadCount} unread</span>}
                                        </div>
                                        <div className="max-h-72 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <p className="text-center text-slate-400 text-sm py-8">No notifications yet.</p>
                                            ) : (
                                                notifications.slice(0, 10).map(n => (
                                                    <div
                                                        key={n._id}
                                                        onClick={() => handleMarkRead(n._id)}
                                                        className={`px-4 py-3 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${
                                                            n.isRead ? 'opacity-60' : 'bg-amber-50/40'
                                                        }`}
                                                    >
                                                        <div className="flex items-start gap-2">
                                                            <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${n.isRead ? 'bg-slate-300' : 'bg-[#B8860B]'}`} />
                                                            <div>
                                                                <p className="text-[13px] text-slate-700 leading-snug font-medium">{n.message}</p>
                                                                <p className="text-[11px] text-slate-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                        <div className="px-4 py-2 border-t border-slate-100">
                                            <Link href="/dashboard" className="text-xs text-[#B8860B] font-semibold hover:underline" onClick={() => setShowBell(false)}>View Dashboard →</Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {isAuthenticated ? (
                            <div className="relative group">
                                <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200">
                                    <User className="w-4 h-4" />
                                    <span className="text-sm font-medium">{user?.name?.split(' ')[0] || 'Profile'}</span>
                                </button>
                                {/* Padded boundary bridges the cursor gap so the hover state isn't lost */}
                                <div className="absolute right-0 top-full pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                    <div className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden py-2 pointer-events-auto">
                                        <Link href="/profile" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">My Profile</Link>
                                        <Link href="/settings" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Settings</Link>
                                        <div className="border-t border-slate-100 my-1"></div>
                                        <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                            <LogOut className="w-4 h-4" /> Sign Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Button
                                id="btn-nav-cta"
                                variant="primary"
                                size="sm"
                                onClick={() => router.push('/login')}
                                className="bg-[#B8860B] hover:bg-[#9a7009] text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                            >
                                Get Started
                            </Button>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden z-50 p-2 text-primary focus:outline-none"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <div className="w-6 flex flex-col items-end gap-1.5">
                            <span className={`block h-0.5 w-full bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                            <span className={`block h-0.5 w-full bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                            <span className={`block h-0.5 w-full bg-current transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                        </div>
                    </button>

                    {/* Mobile Navigation Overlay */}
                    <div
                        className={`fixed inset-0 bg-white z-40 flex flex-col items-center justify-start pt-28 h-[100dvh] transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                            }`}
                    >
                        <nav className="flex flex-col items-center gap-8 text-center">
                            {currentNavLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="font-heading text-2xl font-bold text-slate-800 hover:text-primary transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="mt-4">
                                {isAuthenticated ? (
                                    <button
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            logout();
                                        }}
                                        className="flex items-center gap-2 text-red-600 font-bold text-lg"
                                    >
                                        <LogOut className="w-5 h-5" /> Sign Out
                                    </button>
                                ) : (
                                    <Button
                                        id="btn-mobile-nav-cta"
                                        variant="primary"
                                        size="lg"
                                        href="/login"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="bg-[#B8860B] hover:bg-[#9a7009] text-white rounded-lg shadow-md hover:shadow-lg"
                                    >
                                        Get Started
                                    </Button>
                                )}
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
}
