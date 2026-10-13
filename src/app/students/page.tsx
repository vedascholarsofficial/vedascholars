import StudentsHero from '@/components/students/StudentsHero';
import StudentAbout from '@/components/students/StudentAbout';
import GlobalDestinations from '@/components/students/GlobalDestinations';
import StudentServices from '@/components/students/StudentServices';
import StudentJourney from '@/components/students/StudentJourney';
import ProgramsAndScholarships from '@/components/students/ProgramsAndScholarships';
import FinalCTA from '@/components/home/FinalCTA';

import { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata('/students');

export default function StudentsPage() {
    return (
        <div className="min-h-screen bg-white">
            <JsonLd data={breadcrumbJsonLd('/students')} />
            <StudentsHero />
            <StudentAbout />
            <GlobalDestinations />
            <StudentServices />
            <StudentJourney />
            <ProgramsAndScholarships />
            <FinalCTA />
        </div>
    );
}
