import React from 'react';
import { Mail, Phone, MapPin, Clock, Globe, Linkedin, Youtube, Facebook, Instagram } from 'lucide-react';

export default function ContactInfo() {
    const contactDetails = [
        {
            icon: <Mail className="w-6 h-6 text-secondary" />,
            title: "Email Us",
            info: "info@vedascholars.com",
            sub: "For general inquiries & partnerships",
            link: "mailto:info@vedascholars.com"
        },
        {
            icon: <Phone className="w-6 h-6 text-secondary" />,
            title: "Call Us",
            info: "+91 7708722334",
            sub: "Mon-Sat, 9:00 AM - 6:00 PM IST",
            link: "tel:+917708722334"
        },
        {
            icon: <Globe className="w-6 h-6 text-secondary" />,
            title: "Visit Website",
            info: "vedascholars.com",
            sub: "Explore our programs",
            link: "https://vedascholars.com/"
        },
        {
            icon: <MapPin className="w-6 h-6 text-secondary" />,
            title: "Visit Us",
            info: "India • United Kingdom • United Arab Emirates",
            sub: "",
            link: null
        }
    ];

    return (
        <div className="h-full flex flex-col justify-center">
            <div className="mb-10">
                <h2 className="text-3xl font-heading font-bold text-primary mb-4">
                    Get in touch directly
                </h2>
                <p className="text-slate-600 leading-relaxed text-lg">
                    Whether you have a simple question or need detailed guidance, our team is ready to assist you.
                </p>
            </div>

            <div className="space-y-8">
                {contactDetails.map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-center shrink-0">
                            {item.icon}
                        </div>
                        <div>
                            <h3 className="font-bold text-primary text-lg">{item.title}</h3>
                            {item.link ? (
                                <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-slate-800 font-medium hover:text-secondary transition-colors">
                                    {item.info}
                                </a>
                            ) : (
                                <p className="text-slate-500 font-normal">
                                    {item.info}
                                </p>
                            )}
                            {item.sub && <p className="text-slate-500 text-sm">{item.sub}</p>}
                        </div>
                    </div>
                ))}
            </div>

            {/* Social Media Section */}
            <div className="mt-10">
                <h3 className="font-bold text-primary text-lg mb-4">Connect with us</h3>
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
                            className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-primary hover:bg-secondary hover:text-white transition-all duration-300"
                            aria-label={`Follow us on ${social.name}`}
                        >
                            <social.icon size={20} />
                        </a>
                    ))}
                </div>
            </div>

            <div className="mt-10 p-6 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-4">
                <Clock className="w-6 h-6 text-primary shrink-0" />
                <div>
                    <h4 className="font-bold text-primary mb-1">Response Guarantee</h4>
                    <p className="text-slate-600 text-sm">
                        We understand anxiety. That's why we promise to respond to every student inquiry within 24 hours.
                    </p>
                </div>
            </div>
        </div>
    );
}
