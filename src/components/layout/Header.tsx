'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BrandWordmark from '../ui/BrandWordmark';
import { HEADER_CTA, PRIMARY_NAV } from '@/lib/site';

const MOBILE_MENU_ID = 'mobile-menu';
// Matches Tailwind's lg breakpoint, where the desktop navigation appears.
const DESKTOP_QUERY = '(min-width: 1024px)';

const isActivePath = (pathname: string, href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

export default function Header() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const toggleRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // On the home page the header floats transparently over the hero image
    const overHero = pathname === '/' && !isScrolled && !isMobileMenuOpen;

    const closeMenu = useCallback((returnFocus = false) => {
        setIsMobileMenuOpen(false);
        if (returnFocus) toggleRef.current?.focus();
    }, []);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        // A reload restores the previous scroll position without firing a scroll event.
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close the menu after navigation (including Back/Forward)...
    const [menuPathname, setMenuPathname] = useState(pathname);
    if (menuPathname !== pathname) {
        setMenuPathname(pathname);
        setIsMobileMenuOpen(false);
    }

    // ...and when the desktop layout takes over.
    useEffect(() => {
        const desktop = window.matchMedia(DESKTOP_QUERY);
        const handleChange = (e: MediaQueryListEvent) => {
            if (e.matches) setIsMobileMenuOpen(false);
        };
        desktop.addEventListener('change', handleChange);
        return () => desktop.removeEventListener('change', handleChange);
    }, []);

    // While the menu is open: lock page scroll, move focus into the menu, close
    // on Escape and keep Tab within the menu and its toggle button.
    useEffect(() => {
        if (!isMobileMenuOpen) return;

        document.body.style.overflow = 'hidden';
        menuRef.current?.querySelector<HTMLElement>('a[href]')?.focus();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                closeMenu(true);
                return;
            }
            if (e.key !== 'Tab' || !menuRef.current || !toggleRef.current) return;

            const focusable = [toggleRef.current, ...menuRef.current.querySelectorAll<HTMLElement>('a[href], button')];
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            const active = document.activeElement as HTMLElement | null;
            const inside = active ? focusable.includes(active) : false;

            if (e.shiftKey && (active === first || !inside)) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && (active === last || !inside)) {
                e.preventDefault();
                first.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isMobileMenuOpen, closeMenu]);

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ${
                    isScrolled || isMobileMenuOpen
                        ? 'bg-white/95 backdrop-blur-xl backdrop-saturate-150 border-b border-slate-200/60 shadow-[0_8px_30px_rgba(36,17,45,0.07)]'
                        : 'bg-transparent border-b border-transparent'
                }`}
            >
                <div className="container mx-auto px-4 md:px-6">
                    <div className={`flex items-center gap-4 xl:gap-6 transition-[height] duration-300 ${isScrolled && !isMobileMenuOpen ? 'h-16' : 'h-20'}`}>
                        {/* Logo */}
                        <Link
                            href="/"
                            className="relative z-50 flex shrink-0 items-center rounded-md group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-4"
                            aria-label="Veda Scholars home"
                        >
                            <BrandWordmark priority inverted={overHero} className="transition-transform duration-300 ease-in-out group-hover:scale-[1.02]" />
                        </Link>

                        {/* Desktop Navigation */}
                        <nav aria-label="Main" className="hidden lg:flex items-center ml-auto">
                            <ul className="flex items-center gap-4 xl:gap-7">
                                {PRIMARY_NAV.map((link) => {
                                    const isActive = isActivePath(pathname, link.href);
                                    return (
                                        <li key={link.href}>
                                            <Link
                                                href={link.href}
                                                aria-current={isActive ? 'page' : undefined}
                                                className={`relative inline-flex h-10 items-center whitespace-nowrap rounded-sm text-[15px] font-medium tracking-[0.01em] transition-colors duration-300 group/nav focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                                                    overHero
                                                        ? `focus-visible:ring-white focus-visible:ring-offset-transparent ${isActive ? 'text-white' : 'text-white/85 hover:text-white'}`
                                                        : `focus-visible:ring-secondary ${isActive ? 'text-secondary' : 'text-primary hover:text-secondary'}`
                                                }`}
                                            >
                                                {link.name}
                                                <span
                                                    aria-hidden="true"
                                                    className={`absolute bottom-0.5 left-0 h-0.5 w-full rounded-full ${overHero ? 'bg-[#E0A6EF]' : 'bg-secondary'} origin-left transition-transform duration-300 ease-out ${
                                                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover/nav:scale-x-100'
                                                    }`}
                                                />
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>

                        <Link
                            id="btn-nav-cta"
                            href={HEADER_CTA.href}
                            aria-current={isActivePath(pathname, HEADER_CTA.href) ? 'page' : undefined}
                            className="hidden lg:inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-secondary px-6 text-sm font-bold text-white shadow-[0_8px_24px_rgba(139,43,180,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#742493] hover:shadow-[0_12px_30px_rgba(139,43,180,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
                        >
                            {HEADER_CTA.name}
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            ref={toggleRef}
                            type="button"
                            className={`lg:hidden relative z-50 ml-auto -mr-2 inline-flex h-11 w-11 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary ${overHero ? 'text-white' : 'text-primary'}`}
                            onClick={() => setIsMobileMenuOpen((open) => !open)}
                            aria-expanded={isMobileMenuOpen}
                            aria-controls={MOBILE_MENU_ID}
                            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                        >
                            <span aria-hidden="true" className="w-6 flex flex-col items-end gap-1.5">
                                <span className={`block h-0.5 w-full bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                                <span className={`block h-0.5 w-full bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                                <span className={`block h-0.5 w-full bg-current transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                            </span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation. Rendered outside <header>: the header's backdrop
                filter would otherwise become the containing block of this fixed
                panel and clip it to the header bar. */}
            <div
                id={MOBILE_MENU_ID}
                ref={menuRef}
                inert={!isMobileMenuOpen}
                className={`lg:hidden fixed inset-x-0 bottom-0 top-20 z-40 overflow-y-auto bg-white transition-opacity duration-300 ${
                    isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                }`}
            >
                <nav aria-label="Mobile" className="container mx-auto px-4 md:px-6 pt-4 pb-10">
                    <ul className="divide-y divide-slate-100 border-y border-slate-100">
                        {PRIMARY_NAV.map((link) => {
                            const isActive = isActivePath(pathname, link.href);
                            return (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        aria-current={isActive ? 'page' : undefined}
                                        onClick={() => closeMenu()}
                                        className={`flex min-h-14 items-center justify-between py-3 font-heading text-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-secondary ${
                                            isActive ? 'text-secondary' : 'text-primary hover:text-secondary'
                                        }`}
                                    >
                                        {link.name}
                                        {isActive && <span aria-hidden="true" className="h-2 w-2 rounded-full bg-secondary" />}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                    <Link
                        id="btn-mobile-nav-cta"
                        href={HEADER_CTA.href}
                        aria-current={isActivePath(pathname, HEADER_CTA.href) ? 'page' : undefined}
                        onClick={() => closeMenu()}
                        className="mt-8 flex h-14 w-full items-center justify-center rounded-full bg-secondary px-8 text-lg font-bold text-white shadow-md transition-colors hover:bg-[#742493] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
                    >
                        {HEADER_CTA.name}
                    </Link>
                </nav>
            </div>
        </>
    );
}
