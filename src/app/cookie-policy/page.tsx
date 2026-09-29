import React from 'react';
import { Metadata } from 'next';
import FadeIn from '@/components/animations/FadeIn';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Cookie Policy | Veda Scholars',
    description: 'Understand how Veda Scholars uses cookies to improve your experience.',
};

export default function CookiePolicyPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <FadeIn>
                    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8 md:p-12">
                        <h1 className="text-3xl md:text-5xl font-heading font-bold text-primary mb-2">Cookie Policy</h1>
                        <p className="text-slate-500 mb-8">Last Updated: January 20, 2026</p>

                        <div className="space-y-8 text-slate-700 leading-relaxed">

                            {/* 1. What Are Cookies */}
                            <section>
                                <h2 className="text-2xl font-bold text-primary mb-4">1. What Are Cookies?</h2>
                                <p>
                                    Think of cookies like small digital post-it notes. When you visit our website, we may store a tiny text file on your device
                                    (computer, tablet, or phone). These files help our website remember you, understand how you use our site, and ensure everything runs smoothly.
                                    They don't harm your computer or carry viruses.
                                </p>
                            </section>

                            {/* 2. Types of Cookies We Use */}
                            <section>
                                <h2 className="text-2xl font-bold text-primary mb-4">2. Types of Cookies We Use</h2>
                                <p className="mb-4">We use three main categories of cookies:</p>

                                <div className="space-y-4">
                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                        <h3 className="font-bold text-primary text-lg">Essential Cookies</h3>
                                        <p className="text-sm mt-1">
                                            These are the "must-haves." Without them, parts of our website simply wouldn't work. They help with security, basic navigation, and ensuring pages load quickly.
                                        </p>
                                    </div>

                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                        <h3 className="font-bold text-primary text-lg">Analytics Cookies</h3>
                                        <p className="text-sm mt-1">
                                            These help us learn. We use tools like Google Analytics to see which pages are popular and how visitors move around our site.
                                            This data is anonymous—we don't know it's you specifically, just that someone visited.
                                        </p>
                                    </div>

                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                        <h3 className="font-bold text-primary text-lg">Marketing Cookies</h3>
                                        <p className="text-sm mt-1">
                                            These help us be relevant. If we advertise our consultancy services on other websites or social media, these cookies help us ensure
                                            you see ads that actually match your educational interests, rather than random content.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* 3. How We Use Cookies */}
                            <section>
                                <h2 className="text-2xl font-bold text-primary mb-4">3. How We Use Cookies</h2>
                                <p>
                                    We primarily use cookies to:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 mt-2">
                                    <li>Keep you signed in (if you have an account).</li>
                                    <li>Remember your preferences (like language or location).</li>
                                    <li>Understand which university programs or services are trending.</li>
                                    <li>Improve the speed and security of our website.</li>
                                </ul>
                            </section>

                            {/* 4. Third-Party Cookies */}
                            <section>
                                <h2 className="text-2xl font-bold text-primary mb-4">4. Third-Party Cookies</h2>
                                <p>
                                    Sometimes we hire trusted partners to help us improve our services. For example, we use Google for analytics or YouTube to host our videos.
                                    These companies may also set their own cookies on your device when you visit our site. We don't control these cookies essentially,
                                    but we only work with reputable partners who respect privacy.
                                </p>
                            </section>

                            {/* 5. How Users Can Manage Cookies */}
                            <section>
                                <h2 className="text-2xl font-bold text-primary mb-4">5. Managing Your Cookies</h2>
                                <p className="mb-4">
                                    You are in control. You can choose to accept or decline cookies.
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><strong>Browser Settings:</strong> Most web browsers (Chrome, Safari, Edge) allow you to block or delete cookies in their settings menu.</li>
                                    <li><strong>"Do Not Track":</strong> You can enable "Do Not Track" features in your browser to tell websites you don't want to be monitored.</li>
                                </ul>
                                <p className="mt-4 text-sm bg-yellow-50 p-3 rounded text-yellow-800">
                                    <strong>Note:</strong> If you block essential cookies, some features of our website (like contact forms) might not work perfectly.
                                </p>
                            </section>

                            {/* 6. Updates to This Policy */}
                            <section>
                                <h2 className="text-2xl font-bold text-primary mb-4">6. Updates to This Policy</h2>
                                <p>
                                    Technology changes fast, and so do we. We may update this Cookie Policy occasionally to reflect changes in our practices or laws.
                                    When we do, we'll update the date at the top of this page.
                                </p>
                            </section>

                            {/* 7. Contact Information */}
                            <section>
                                <h2 className="text-2xl font-bold text-primary mb-4">7. Questions?</h2>
                                <p className="mb-4">
                                    If you're unsure about how we use cookies, we're happy to explain.
                                </p>
                                <p>
                                    <strong>Email us:</strong> <a href="mailto:privacy@vedascholars.com" className="text-primary font-medium hover:underline">privacy@vedascholars.com</a>
                                </p>
                                <p className="mt-4 text-sm text-slate-500">
                                    For more details on how we handle your data generally, please read our <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
                                </p>
                            </section>

                        </div>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}
