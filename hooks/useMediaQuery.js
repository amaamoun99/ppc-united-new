'use client';

import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

export function useMediaQuery() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mobileQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const tabletQuery = window.matchMedia(`(max-width: ${TABLET_BREAKPOINT}px)`);
    const checkTouch = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    const update = () => {
      setIsMobile(mobileQuery.matches);
      setIsTablet(tabletQuery.matches);
      setIsTouch(checkTouch());
    };

    update();

    const mobileHandler = (e) => setIsMobile(e.matches);
    const tabletHandler = (e) => setIsTablet(e.matches);
    
    mobileQuery.addEventListener('change', mobileHandler);
    tabletQuery.addEventListener('change', tabletHandler);
    
    return () => {
      mobileQuery.removeEventListener('change', mobileHandler);
      tabletQuery.removeEventListener('change', tabletHandler);
    };
  }, []);

  return { isMobile, isTablet, isTouch };
}
