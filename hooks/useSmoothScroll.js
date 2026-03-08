'use client';

import { useLenis } from '@/lib/lenis';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export function useSmoothScroll() {
  const { isMobile } = useMediaQuery();
  useLenis({ enabled: !isMobile });
}

