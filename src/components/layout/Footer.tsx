'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Facebook, Linkedin, Instagram, Youtube, Mail, Phone, Globe } from 'lucide-react';
import BrandWordmark from '../ui/BrandWordmark';

export default function Footer() {
    const pathname = usePathname();
    const currentYear = new Date().getFullYear();

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        // If clicking the link for the current page, scroll to top
        if (pathname === href) {
            e.preventDefault(); // Prevent default since we are already here
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    const linkGroups = [
        {
            title: "Company",
            links: [
                { name: "About Us", href: "/about" },
                { name: "Services", href: "/services" },
                { name: "Careers", href: "/careers" },
                { name: "Contact", href: "/contact" },
            ]
        },
        {
            title: "For Students",
            links: [
                { name: "Study Abroad", href: "/students" },
                { name: "Internships", href: "/students" },
                { name: "Scholarships", href: "/students" },
                { name: "Success Stories", href: "/students" },
            ]
        },
        {
            title: "For Universities",
            links: [
                { name: "Partner With Us", href: "/partner-with-us" },
                { name: "Our Network", href: "/partner-with-us" },
                { name: "Recruitment", href: "/partner-with-us" },
            ]
        }
    ];

    return (
        <footer className="bg-primary text-slate-200 pt-20 pb-10 mt-auto">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
                    {/* Brand Column (Span 2) */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-6 text-white group" onClick={(e) => handleLinkClick(e, '/')}>
                            <BrandWordmark inverted className="transition-transform duration-300 ease-in-out group-hover:scale-[1.02]" />
                        </Link>
                        <p className="text-white/70 mb-8 leading-relaxed max-w-sm">
                            Bridging the gap between education and employment.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3 mb-8">
                            <a href="https://vedascholars.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/70 hover:text-accent transition-colors group/link">
                                <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-accent group-hover/link:bg-secondary group-hover/link:text-white transition-colors">
                                    <Globe size={16} />
                                </div>
                                <span className="text-sm">vedascholars.com</span>
                            </a>
                            <a href="mailto:info@vedascholars.com" className="flex items-center gap-3 text-white/70 hover:text-accent transition-colors group/link">
                                <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-accent group-hover/link:bg-secondary group-hover/link:text-white transition-colors">
                                    <Mail size={16} />
                                </div>
                                <span className="text-sm">info@vedascholars.com</span>
                            </a>
                            <a href="tel:+917708722334" className="flex items-center gap-3 text-white/70 hover:text-accent transition-colors group/link">
                                <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-accent group-hover/link:bg-secondary group-hover/link:text-white transition-colors">
                                    <Phone size={16} />
                                </div>
                                <span className="text-sm">+91 7708722334</span>
                            </a>
                        </div>

                        <div className="flex gap-4">
                            {[
                                { name: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/company/veda-scholars/' },
                                { name: 'YouTube', icon: Youtube, href: 'https://www.youtube.com/@VedaScholars-q5' },
                                { name: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/VedaScholars/' },
                                { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/veda_scholars/' },
                            ].map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-accent hover:bg-secondary hover:text-white transition-all duration-300"
                                    aria-label={`Follow us on ${social.name}`}
                                >
                                    <social.icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link Columns */}
                    {linkGroups.map((group) => (
                        <div key={group.title}>
                            <h3 className="font-heading font-bold text-white text-lg mb-6">{group.title}</h3>
                            <ul className="space-y-4">
                                {group.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-white/70 hover:text-accent transition-colors"
                                            onClick={(e) => handleLinkClick(e, link.href)}
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Legal Column (New) */}
                    <div>
                        <h3 className="font-heading font-bold text-white text-lg mb-6">Legal</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/privacy-policy" className="text-white/70 hover:text-accent transition-colors" onClick={(e) => handleLinkClick(e, '/privacy-policy')}>Privacy Policy</Link>
                            </li>
                            <li>
                                <Link href="/terms-of-service" className="text-white/70 hover:text-accent transition-colors" onClick={(e) => handleLinkClick(e, '/terms-of-service')}>Terms of Service</Link>
                            </li>
                            <li>
                                <Link href="/cookie-policy" className="text-white/70 hover:text-accent transition-colors" onClick={(e) => handleLinkClick(e, '/cookie-policy')}>Cookie Policy</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-white/60 text-sm">
                    <p>&copy; {currentYear} Veda Scholars. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
