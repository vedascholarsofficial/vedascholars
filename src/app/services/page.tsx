import React from 'react';
import ServicesHero from '@/components/services/ServicesHero';
import ServiceDetailedList from '@/components/services/ServiceDetailedList';
import OfferingCTA from '@/components/offerings/OfferingCTA';

import { Metadata } from 'next';

export const metadata: Metadata = {
    alternates: { canonical: '/services' },
    title: 'Services | Five Pillars of Student Support',
    description: 'Explore Discover & Decide, Access & Affordability, Prepare & Settle, Learn, Connect & Grow, and Career & Beyond with Veda Scholars.',
};

export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-white">
            <ServicesHero />
            <ServiceDetailedList />
            <OfferingCTA title="Find the support that fits your next step." description="Tell us where you are in your student journey. We will help you explore relevant services and agree a practical plan." secondaryHref="/programs" secondaryLabel="Explore Our Programs" />
        </div>
    );
}
