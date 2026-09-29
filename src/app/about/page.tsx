import AboutHero from '@/components/about/AboutHero';
import VisionMission from '@/components/about/VisionMission';
import FounderStory from '@/components/about/FounderStory';
import CoreValues from '@/components/about/CoreValues';
import WhyChooseUs from '@/components/about/WhyChooseUs';
import FinalCTA from '@/components/home/FinalCTA'; // Reusing Final CTA

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Veda Scholars | Global Education & Career Experts',
    description: 'Learn about Veda Scholars, a trusted education-to-employment consultancy supporting students, universities, and employers worldwide.',
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            <AboutHero />
            <VisionMission />
            <FounderStory />
            <CoreValues />
            <WhyChooseUs />
            <FinalCTA />
        </div>
    );
}
