import Hero from "@/components/home/Hero";
import TrustSignals from "@/components/home/TrustSignals";
import ModelSection from "@/components/home/ModelSection";
import ServicesOverview from "@/components/home/ServicesOverview";
import PsychometricCTA from "@/components/home/PsychometricCTA";
import FinalCTA from "@/components/home/FinalCTA";
import IntroLoader from "@/components/animations/IntroLoader";

import { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { organizationJsonLd, pageMetadata, websiteJsonLd } from '@/lib/seo';

export const metadata: Metadata = pageMetadata('/');

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      <IntroLoader />
      <Hero />
      <TrustSignals />
      <ModelSection />
      <ServicesOverview />
      <PsychometricCTA />
      <FinalCTA />
    </div>
  );
}
