import React from 'react';
import ServicesHero from '@/components/services/ServicesHero';
import ServiceDetailedList from '@/components/services/ServiceDetailedList';
import FinalCTA from '@/components/home/FinalCTA';

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Our Services | Education, Recruitment & Career Support',
    description: 'Explore Veda Scholars services including education counselling, university partnerships, recruitment solutions, and career guidance.',
};

export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-white">
            <ServicesHero />
            <ServiceDetailedList />
            <FinalCTA />
        </div>
    );
}
