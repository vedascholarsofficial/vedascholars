import React from 'react';
import { Metadata } from 'next';
import FadeIn from '@/components/animations/FadeIn';

export const metadata: Metadata = {
    title: 'Terms of Service | Veda Scholars',
    description: 'Terms and conditions governing the use of Veda Scholars services.',
};

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <FadeIn>
                    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8 md:p-12">
                        <h1 className="text-3xl md:text-5xl font-heading font-bold text-primary mb-2">Terms of Service</h1>
                        <p className="text-slate-500 mb-8">Last Updated: January 20, 2026</p>

                        <div className="space-y-8 text-slate-700 leading-relaxed">

                            {/* 1. Acceptance of Terms */}
                            <section>
                                <h2 className="text-2xl font-bold text-primary mb-4">1. Acceptance of Terms</h2>
                                <p>
                                    By accessing the Veda Scholars website or engaging our consultancy services, you agree to comply with and be bound by these Terms of Service.
                                    If you do not agree to these terms, please do not use our services.
                                </p>
                            </section>

                            {/* 2. Services Overview */}
                            <section>
                                <h2 className="text-2xl font-bold text-primary mb-4">2. Services Overview</h2>
                                <p>
                                    Veda Scholars provides education consultancy, career counselling, and recruitment support services. We assist students
                                    with university admissions, scholarship applications, and career mapping. We also partner with universities for student recruitment
                                    and with employers for placement support.
                                </p>
                            </section>

                            {/* 3. Eligibility to Use Services */}
                            <section>
                                <h2 className="text-2xl font-bold text-primary mb-4">3. Eligibility to Use Services</h2>
                                <p>
                                    You must be at least 16 years of age to use our services independently. If you are under 18, you represent that you have
                                    obtained parental or guardian consent. By using our services, you warrant that all information you submit is truthful and accurate.
                                </p>
                            </section>

                            {/* 4. User Responsibilities */}
                            <section>
                                <h2 className="text-2xl font-bold text-primary mb-4">4. User Responsibilities</h2>
                                <p className="mb-4">As a user, you agree to:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Provide accurate, current, and complete information during the application or consultation process.</li>
                                    <li>Respond promptly to requests for documents or information needed for your applications.</li>
                                    <li>Not use our services for any fraudulent or illegal purpose.</li>
                                    <li>Respect the intellectual property rights of Veda Scholars and third parties.</li>
                                </ul>
                            </section>

                            {/* 5. No Guarantee of Admission or Employment */}
                            <section>
                                <h2 className="text-2xl font-bold text-primary mb-4">5. No Guarantee of Admission or Employment</h2>
                                <p className="font-medium text-slate-900 mb-2">Please read this section carefully.</p>
                                <p>
                                    While Veda Scholars uses its expertise and network to maximize your chances of success, <strong>we do not and cannot guarantee</strong>:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 mt-2">
                                    <li>Admission to any specific university or educational institution.</li>
                                    <li>The awarding of any specific scholarship or financial aid.</li>
                                    <li>Successful placement in any specific job, internship, or employment role.</li>
                                    <li>Visa approval by any government authority.</li>
                                </ul>
                                <p className="mt-2">
                                    Admissions and hiring decisions are made solely by the respective institutions and employers.
                                </p>
                            </section>

                            {/* 6. Fees & Payments */}
                            <section>
                                <h2 className="text-2xl font-bold text-primary mb-4">6. Fees & Payments</h2>
                                <p>
                                    Some initial counselling sessions may be free of charge. Specialized services, premium packages, or expedited processing may incur fees.
                                    All fees will be clearly communicated to you in writing before you incur any charges. Payments made for services rendered are generally non-refundable,
                                    except as explicitly stated in a separate service agreement.
                                </p>
                            </section>

                            {/* 7. Intellectual Property */}
                            <section>
                                <h2 className="text-2xl font-bold text-primary mb-4">7. Intellectual Property</h2>
                                <p>
                                    All content, branding, designs, logos, and materials on the Veda Scholars website are the intellectual property of Veda Scholars.
                                    You may not reproduce, distribute, or create derivative works from our content without our express written permission.
                                </p>
                            </section>

                            {/* 8. Limitation of Liability */}
                            <section>
                                <h2 className="text-2xl font-bold text-primary mb-4">8. Limitation of Liability</h2>
                                <p>
                                    To the fullest extent permitted by law, Veda Scholars shall not be liable for any indirect, incidental, special, consequential,
                                    or punitive damages, including loss of opportunities or data, arising out of or in connection with your use of our services.
                                </p>
                            </section>

                            {/* 9. Termination of Use */}
                            <section>
                                <h2 className="text-2xl font-bold text-primary mb-4">9. Termination of Use</h2>
                                <p>
                                    We reserve the right to terminate or suspend your access to our services at our sole discretion, without prior notice,
                                    for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties, or for any other reason.
                                </p>
                            </section>

                            {/* 10. Governing Law & Jurisdiction */}
                            <section>
                                <h2 className="text-2xl font-bold text-primary mb-4">10. Governing Law & Jurisdiction</h2>
                                <p>
                                    These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under or in connection
                                    with these Terms shall be subject to the exclusive jurisdiction of the courts located in New Delhi, India.
                                </p>
                            </section>

                            {/* 11. Changes to Terms */}
                            <section>
                                <h2 className="text-2xl font-bold text-primary mb-4">11. Changes to Terms</h2>
                                <p>
                                    We reserve the right to modify these Terms at any time. We will provide notice of significant changes by posting the new Terms on this site.
                                    Your continued use of the Service after such changes constitutes your acceptance of the new Terms.
                                </p>
                            </section>

                            {/* 12. Contact Information */}
                            <section>
                                <h2 className="text-2xl font-bold text-primary mb-4">12. Contact Information</h2>
                                <p className="mb-2">For any questions regarding these Terms of Service, please contact us:</p>
                                <ul className="list-none space-y-1">
                                    <li><strong>Email:</strong> legal@vedascholars.com</li>
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
