import React from 'react';
import { Metadata } from 'next';
import FadeIn from '@/components/animations/FadeIn';

export const metadata: Metadata = {
    title: 'Privacy Policy | Veda Scholars',
    description: 'Learn how Veda Scholars collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <FadeIn>
                    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8 md:p-12">
                        <h1 className="text-3xl md:text-5xl font-heading font-bold text-primary mb-2">Privacy Policy</h1>
                        <p className="text-slate-500 mb-8">Last Updated: January 20, 2026</p>

                        <div className="space-y-8 text-slate-700 leading-relaxed">

                            {/* 1. Introduction */}
                            <section>
                                <h2 className="text-2xl font-bold text-primary mb-4">1. Introduction</h2>
                                <p>
                                    Veda Scholars ("we," "our," or "us") is dedicated to guiding students from education to employment.
                                    We respect your privacy and are committed to protecting the personal information you share with us.
                                    This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website
                                    or engage with our consultancy services, including university admissions, career counselling, and recruitment support.
                                </p>
                            </section>

                            {/* 2. Information We Collect */}
                            <section>
                                <h2 className="text-2xl font-bold text-primary mb-4">2. Information We Collect</h2>
                                <p className="mb-4">
                                    We collect information to provide specialized educational and career services. This includes:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><strong>Personal Identification Information:</strong> Name, email address, phone number, date of birth, and passport details (where necessary for admissions).</li>
                                    <li><strong>Academic & Professional Information:</strong> Educational transcripts, resumes/CVs, test scores (IELTS, GRE, etc.), and employment history.</li>
                                    <li><strong>Usage Data:</strong> Information about your device, browser type, IP address, and how you interact with our website to improve user experience.</li>
                                </ul>
                            </section>

                            {/* 3. How We Use Your Information */}
                            <section>
                                <h2 className="text-2xl font-bold text-primary mb-4">3. How We Use Your Information</h2>
                                <p className="mb-4">We use the collected data for specific, service-oriented purposes:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><strong>Service Delivery:</strong> To process university applications, facilitate job placements, and provide career counselling.</li>
                                    <li><strong>Communication:</strong> To respond to your inquiries, send application updates, and provide relevant educational newsletters.</li>
                                    <li><strong>Optimization:</strong> To analyze website traffic and improve our digital platforms.</li>
                                    <li><strong>Compliance:</strong> To fulfill legal or regulatory requirements associated with international education and employment.</li>
                                </ul>
                            </section>

                            {/* 4. Data Sharing & Disclosure */}
                            <section>
                                <h2 className="text-2xl font-bold text-primary mb-4">4. Data Sharing & Disclosure</h2>
                                <p className="mb-4">
                                    We do not sell your personal data. We may share your information responsibly with:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><strong>Educational Institutions:</strong> Universities and colleges you choose to apply to.</li>
                                    <li><strong>Recruiters & Employers:</strong> Potential employers, specifically for our placement and recruitment services.</li>
                                    <li><strong>Service Providers:</strong> Targeted third-party vendors who assist with IT support, data hosting, or marketing (under strict confidentiality agreements).</li>
                                    <li><strong>Legal Authorities:</strong> When required by law to protect our rights or comply with a judicial proceeding.</li>
                                </ul>
                            </section>

                            {/* 5. Cookies & Tracking Technologies */}
                            <section>
                                <h2 className="text-2xl font-bold text-primary mb-4">5. Cookies & Tracking Technologies</h2>
                                <p>
                                    We use cookies and similar tracking technologies to track activity on our service and hold certain information.
                                    Cookies allow us to remember your preferences and recognize you on return visits. You can instruct your browser to refuse
                                    all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able
                                    to use some portions of our service effectively.
                                </p>
                            </section>

                            {/* 6. Data Security */}
                            <section>
                                <h2 className="text-2xl font-bold text-primary mb-4">6. Data Security</h2>
                                <p>
                                    We implement robust security measures to maintain the safety of your personal information.
                                    While no method of transmission over the Internet or method of electronic storage is 100% secure,
                                    we strive to use commercially acceptable means to protect your personal data against unauthorized access, alteration, or disclosure.
                                </p>
                            </section>

                            {/* 7. International Data Transfers */}
                            <section>
                                <h2 className="text-2xl font-bold text-primary mb-4">7. International Data Transfers</h2>
                                <p>
                                    As an international consultancy operating in India, the UK, the UAE, and beyond, your information may be transferred to
                                    — and maintained on — computers located outside of your state, province, country, or other governmental jurisdiction
                                    where the data protection laws may differ. By submitting your information, you consent to this transfer, ensuring appropriate
                                    safeguards are in place.
                                </p>
                            </section>

                            {/* 8. User Rights */}
                            <section>
                                <h2 className="text-2xl font-bold text-primary mb-4">8. User Rights</h2>
                                <p className="mb-4">Depending on your jurisdiction, you may have the right to:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Access the personal data we hold about you.</li>
                                    <li>Request correction of any incorrect data.</li>
                                    <li>Request deletion of your personal data ("Right to be Forgotten").</li>
                                    <li>Object to or restrict the processing of your data.</li>
                                </ul>
                                <p className="mt-4">To exercise these rights, please contact us at the details provided below.</p>
                            </section>

                            {/* 9. Third-Party Links */}
                            <section>
                                <h2 className="text-2xl font-bold text-primary mb-4">9. Third-Party Links</h2>
                                <p>
                                    Our website may contain links to external sites (such as universities or partner organizations) that are not operated by us.
                                    We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
                                    We strongly advise you to review the Privacy Policy of every site you visit.
                                </p>
                            </section>

                            {/* 10. Updates to This Policy */}
                            <section>
                                <h2 className="text-2xl font-bold text-primary mb-4">10. Updates to This Policy</h2>
                                <p>
                                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page
                                    and updating the "Last Updated" date at the top. You are advised to review this Privacy Policy periodically for any changes.
                                </p>
                            </section>

                            {/* 11. Contact Information */}
                            <section>
                                <h2 className="text-2xl font-bold text-primary mb-4">11. Contact Information</h2>
                                <p className="mb-2">If you have any questions about this Privacy Policy, please contact us:</p>
                                <ul className="list-none space-y-1">
                                    <li><strong>Email:</strong> privacy@vedascholars.com</li>
                                    <li><strong>Phone:</strong> +91 98765 43210</li>
                                    <li><strong>Address:</strong> Veda Scholars, Corporate Office, India</li>
                                </ul>
                            </section>

                        </div>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}
