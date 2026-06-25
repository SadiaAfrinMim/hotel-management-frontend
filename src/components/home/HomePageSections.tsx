'use client';

import { useContext } from 'react';
import { HomeContext } from '@/components/home/HomeContext';
import TrustBadges from '@/components/home/TrustBadges';
import GlobalDestinations from '@/components/home/GlobalDestinations';
import StatsCounter from '@/components/home/StatsCounter';
import Testimonials from '@/components/home/Testimonials';
import NewsletterCTA from '@/components/home/NewsletterCTA';
import FAQSection from '@/components/home/FAQSection';
import AnimatedSection from '@/components/home/AnimatedSection';

export default function HomePageSections() {
  const { destinations, isLoadingDestinations } = useContext(HomeContext);

  return (
    <>
      <AnimatedSection>
        <TrustBadges />
      </AnimatedSection>
      <AnimatedSection delay={100}>
        <GlobalDestinations destinations={destinations} isLoading={isLoadingDestinations} />
      </AnimatedSection>
      <AnimatedSection delay={200}>
        <StatsCounter />
      </AnimatedSection>
      <AnimatedSection delay={100}>
        <Testimonials />
      </AnimatedSection>
      <AnimatedSection delay={200}>
        <FAQSection />
      </AnimatedSection>
      <AnimatedSection delay={300}>
        <NewsletterCTA />
      </AnimatedSection>
    </>
  );
}
