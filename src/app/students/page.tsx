import StudentsHero from '@/components/students/StudentsHero';
import StudentAbout from '@/components/students/StudentAbout';
import GlobalDestinations from '@/components/students/GlobalDestinations';
import StudentServices from '@/components/students/StudentServices';
import StudentJourney from '@/components/students/StudentJourney';
import ProgramsAndScholarships from '@/components/students/ProgramsAndScholarships';
import FinalCTA from '@/components/home/FinalCTA';

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Study Abroad & Career Guidance for Students | Veda Scholars',
    description: 'Get expert study abroad counselling, university selection, scholarships, visa support, and career guidance with Veda Scholars.',
    keywords: ['Student Guidance', 'Scholarship Help', 'Study Abroad mentorship', 'Career Counselling', 'Pre-departure training'],
};

export default function StudentsPage() {
    return (
        <div className="min-h-screen bg-white">
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
