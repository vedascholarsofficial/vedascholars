'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FinalCTA from '@/components/home/FinalCTA';
import UniversitiesContent from '@/components/universities/UniversitiesContent';
import UniversityMarquee from '@/components/partner/UniversityMarquee';
import EmployersContent from '@/components/partner/EmployersContent';
import PartnerHero from '@/components/partner/PartnerHero';

export default function PartnerWithUsPage() {
    const [activeTab, setActiveTab] = useState<'universities' | 'employers'>('universities');

    return (
        <div className="min-h-screen bg-white">
            {/* Unified Hero with Integrated Toggle */}
            <PartnerHero activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Content Switcher */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'universities' ? (
                        <>
                            {/* Universities Content */}
                            <UniversitiesContent />
                            <UniversityMarquee />
                            <FinalCTA />
                        </>
                    ) : (
                        <>
                            {/* Employers Content */}
                            <EmployersContent />
                        </>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
