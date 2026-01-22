'use client';

import { useEffect } from 'react';
import { ScrollTrigger } from '@/lib/gsap';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import LatestProjects from '@/components/LatestProjects';
import MediaNews from '@/components/MediaNews';
import GetInTouch from '@/components/GetInTouch';
import HorizontalTimeline from '@/components/HorizontalTimeline';

export default function Home() {
  // Global refresh once on mount to align all pins
  useEffect(() => {
    // Wait for window load to ensure all images/fonts are loaded before GSAP calculates start/end points
    const handleLoad = () => {
      // Small delay to ensure all components have initialized their ScrollTriggers
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  return (
    <main className="bg-stone-900">
      <Hero />
      <Services />
      <LatestProjects />
      <HorizontalTimeline />
      <MediaNews />

      <GetInTouch />
    </main>
  );
}