'use client';

import { useEffect, useRef, useCallback } from 'react';
import { ScrollTrigger } from '@/lib/gsap';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import ClientsPartners from '@/components/ClientsPartners';
import LatestProjects from '@/components/LatestProjects';
import MediaNews from '@/components/MediaNews';
import GetInTouch from '@/components/GetInTouch';
import HorizontalTimeline from '@/components/HorizontalTimeline';
import AboutTeaser from '@/components/AboutTeaser';

export default function Home() {
  const refreshTimeoutRef = useRef(null);

  const onContentReady = useCallback(() => {
    ScrollTrigger.refresh();
    if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
    refreshTimeoutRef.current = setTimeout(() => {
      ScrollTrigger.refresh();
      refreshTimeoutRef.current = null;
    }, 450);
  }, []);

  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => ScrollTrigger.refresh(), 100);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }

    return () => {
      if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
    };
  }, []);

  return (
    <main className="bg-stone-900">
      <Hero />
      <Services />
      <ClientsPartners />
      <LatestProjects onContentReady={onContentReady} />
      <AboutTeaser />
      <HorizontalTimeline />
      <MediaNews onContentReady={onContentReady} />

      <GetInTouch />
    </main>
  );
}