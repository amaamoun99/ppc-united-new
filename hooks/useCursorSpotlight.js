'use client';

import { useEffect, useRef } from 'react';

export function useCursorSpotlight(containerRef) {
  const spotlightRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const spotlight = spotlightRef.current;

    const handleMouseMove = (e) => {
      if (!spotlight) return;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      spotlight.style.left = `${x}px`;
      spotlight.style.top = `${y}px`;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.style.cursor = 'none';

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.style.cursor = 'default';
    };
  }, [containerRef]);

  return spotlightRef;
}

