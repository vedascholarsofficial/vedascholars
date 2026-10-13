import React from 'react';
import ServicesHero from '@/components/services/ServicesHero';
import ServiceDetailedList from '@/components/services/ServiceDetailedList';
import OfferingCTA from '@/components/offerings/OfferingCTA';

import { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata('/services');

export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-white">
            <JsonLd data={breadcrumbJsonLd('/services')} />
            <ServicesHero />
            <ServiceDetailedList />
            <OfferingCTA title="Find the support that fits your next step." description="Tell us where you are in your student journey. We will help you explore relevant services and agree a practical plan." secondaryHref="/programs" secondaryLabel="Explore Our Programs" />
        </div>
    );
}
