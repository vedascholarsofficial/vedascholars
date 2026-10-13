import AboutHero from '@/components/about/AboutHero';
import VisionMission from '@/components/about/VisionMission';
import FounderStory from '@/components/about/FounderStory';
import CoreValues from '@/components/about/CoreValues';
import WhyChooseUs from '@/components/about/WhyChooseUs';
import FinalCTA from '@/components/home/FinalCTA'; // Reusing Final CTA

import { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata('/about');

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            <JsonLd data={breadcrumbJsonLd('/about')} />
            <AboutHero />
            <VisionMission />
            <FounderStory />
            <CoreValues />
            <WhyChooseUs />
            <FinalCTA />
        </div>
    );
}
