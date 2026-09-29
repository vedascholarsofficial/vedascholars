import React from 'react';
import { Shield, Star, Heart, FileText } from 'lucide-react';

export default function CoreValues() {
    const values = [
        {
            id: 1,
            name: "Integrity",
            description: "We adhere to the highest ethical standards. No hidden costs, no false promises.",
            icon: <Shield className="w-8 h-8 text-white" />
        },
        {
            id: 2,
            name: "Excellence",
            description: "We strive for perfection in every application, every essay, and every counseling session.",
            icon: <Star className="w-8 h-8 text-white" />
        },
        {
            id: 3,
            name: "Empathy",
            description: "We understand the anxiety of career planning. We listen, we care, and we guide.",
            icon: <Heart className="w-8 h-8 text-white" />
        },
        {
            id: 4,
            name: "Transparency",
            description: "Clear processes and honest feedback. You will always know where you stand.",
            icon: <FileText className="w-8 h-8 text-white" />
        }
    ];

    return (
        <section className="py-16 md:py-20 bg-[#0A2647] text-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-white">Our Core Values</h2>
                    <p className="text-slate-200 max-w-2xl mx-auto text-lg">
                        The principles that guide every decision we make and every student we help.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {values.map((v) => (
                        <div key={v.id} className="bg-[#0F355A] p-8 rounded-xl border border-[#1E4D7B] hover:border-[#B8860B] transition-all duration-300 hover:-translate-y-1 shadow-lg group">
                            <div className="w-14 h-14 bg-white/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#B8860B] transition-colors duration-300">
                                {v.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">{v.name}</h3>
                            <p className="text-slate-100 leading-relaxed text-sm">
                                {v.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
