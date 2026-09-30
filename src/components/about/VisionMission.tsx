import React from 'react';
import { Target, Compass } from 'lucide-react';

export default function VisionMission() {
    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                    {/* Vision */}
                    <div className="bg-white p-10 rounded-2xl shadow-sm border-l-4 border-secondary hover:shadow-md transition-shadow">
                        <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                            <Target className="w-8 h-8 text-secondary" />
                        </div>
                        <h3 className="text-2xl font-heading font-bold text-primary mb-4">Our Vision</h3>
                        <p className="text-slate-600 leading-relaxed text-lg">
                            To be the world's most trusted partner in education-to-employment transitions, creating a future where every student's potential is fully realized through global opportunities.
                        </p>
                    </div>

                    {/* Mission */}
                    <div className="bg-white p-10 rounded-2xl shadow-sm border-l-4 border-primary hover:shadow-md transition-shadow">
                        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                            <Compass className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-2xl font-heading font-bold text-primary mb-4">Our Mission</h3>
                        <p className="text-slate-600 leading-relaxed text-lg">
                            We empower students by providing ethical, transparent, and personalized guidance. We commit to supporting them not just in admission, but throughout their journey to a meaningful career.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}
