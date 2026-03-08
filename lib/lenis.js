'use client';

import Lenis from 'lenis';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let lenisInstance = null;

export function useLenis(options = {}) {
  const enabled = options.enabled !== false;

  useEffect(() => {
    if (typeof window === 'undefined' || !enabled) {
      if (lenisInstance) {
        lenisInstance.destroy();
        lenisInstance = null;
        if (typeof window !== 'undefined') window.lenis = null;
      }
      return;
    }

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

    // Animation frame loop (guard: lenisInstance may be null after cleanup)
    let rafId = null;
    function raf(time) {
      if (!lenisInstance) return;
      lenisInstance.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Cleanup
    return () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      if (lenisInstance) {
        lenisInstance.destroy();
        lenisInstance = null;
        window.lenis = null;
      }
    };
  }, [enabled]);
}

export function getLenis() {
  return lenisInstance;
}

