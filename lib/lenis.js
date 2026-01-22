'use client';

import Lenis from 'lenis';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let lenisInstance = null;

export function useLenis() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize Lenis
    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Expose Lenis to window for other components
    window.lenis = lenisInstance;

    // Sync Lenis with ScrollTrigger
    lenisInstance.on('scroll', () => {
      ScrollTrigger.update();
    });

    // Animation frame loop
    function raf(time) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      if (lenisInstance) {
        lenisInstance.destroy();
        lenisInstance = null;
        window.lenis = null;
      }
    };
  }, []);
}

export function getLenis() {
  return lenisInstance;
}

