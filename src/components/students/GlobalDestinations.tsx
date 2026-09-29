import React from 'react';
import Image from 'next/image';
import FadeIn from '@/components/animations/FadeIn';

export default function GlobalDestinations() {
    const destinations = [
        {
            name: "USA",
            image: "https://images.unsplash.com/photo-1534270804882-6b5048b1c1fc?q=80&w=2070&auto=format&fit=crop", // Robust NYC Image
            desc: "Ivy League & Top Tier"
        },
        {
            name: "UK",
            image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop", // Big Ben
            desc: "Russell Group & More"
        },
        {
            name: "Canada",
            image: "https://images.unsplash.com/photo-1517935706615-2717063c2225?q=80&w=2070&auto=format&fit=crop", // Canada City
            desc: "Quality Life & Education"
        },
        {
            name: "Europe",
            image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2070&auto=format&fit=crop", // Paris
            desc: "Germany, France & Ireland"
        },
        {
            name: "Australia",
            image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=2070&auto=format&fit=crop", // Distinct Sydney Opera House
            desc: "Go8 Universities"
        },
        {
            name: "Asia",
            image: "https://images.unsplash.com/photo-1535139262971-c51845709a48?q=80&w=2070&auto=format&fit=crop", // Singapore
            desc: "Singapore & Dubai"
        }
    ];

    return (
        <section className="py-16 md:py-20 bg-slate-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">
                        Countries We <span className="text-[#B8860B]">Support</span>
                    </h2>
                    <p className="text-slate-600">Your gateway to world-class education across the globe.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {destinations.map((dest, index) => (
                        <FadeIn key={index} delay={index * 0.1}>
                            <div className="group relative h-80 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500">
                                <Image
                                    src={dest.image}
                                    alt={`Study in ${dest.name}`}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-6 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-2xl font-bold font-heading mb-1 text-white drop-shadow-md">{dest.name}</h3>
                                    <p className="text-sm text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium drop-shadow-sm">{dest.desc}</p>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
