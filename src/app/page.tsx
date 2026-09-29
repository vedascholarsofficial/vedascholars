import Hero from "@/components/home/Hero";
import TrustSignals from "@/components/home/TrustSignals";
import ModelSection from "@/components/home/ModelSection";
import ServicesOverview from "@/components/home/ServicesOverview";
import PsychometricCTA from "@/components/home/PsychometricCTA";
import Testimonials from "@/components/home/Testimonials";
import FinalCTA from "@/components/home/FinalCTA";
import FadeIn from "@/components/animations/FadeIn";

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Veda Scholars | Education to Employment Consultancy',
  description: 'Veda Scholars helps students, universities, and employers bridge the gap between education and employment through global counselling, partnerships, and recruitment support.',
  keywords: ['Study Abroad', 'Education Consultant', 'Career Mapping', 'Global Recruitment', 'University Partners'],
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <TrustSignals />
      <ModelSection />
      <ServicesOverview />
      <PsychometricCTA />
      <Testimonials />
      <FinalCTA />
    </div>
  );
}
