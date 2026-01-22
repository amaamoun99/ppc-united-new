'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Helper function to split text into words/chars (alternative to SplitText)
export function splitText(element, type = 'words') {
  if (!element) return [];
  
  const text = element.textContent;
  const words = text.split(' ');
  const chars = text.split('');
  
  element.innerHTML = '';
  
  if (type === 'words') {
    return words.map((word, i) => {
      const span = document.createElement('span');
      span.textContent = word + (i < words.length - 1 ? ' ' : '');
      span.style.display = 'inline-block';
      span.style.overflow = 'hidden';
      element.appendChild(span);
      return span;
    });
  } else {
    return chars.map((char) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.display = 'inline-block';
      element.appendChild(span);
      return span;
    });
  }
}

// Helper for text reveal animations
export function animateTextReveal(element, direction = 'up') {
  if (!element) return;
  
  const words = splitText(element, 'words');
  
  gsap.fromTo(
    words,
    {
      y: direction === 'up' ? 100 : -100,
      opacity: 0,
    },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.05,
      ease: 'power3.out',
    }
  );
}

// Helper for scroll-triggered animations
export function createScrollAnimation(element, options = {}) {
  const {
    trigger = element,
    start = 'top 80%',
    end = 'bottom 20%',
    animation = null,
    scrub = false,
    pin = false,
    markers = false,
  } = options;

  return gsap.to(element, {
    ...animation,
    scrollTrigger: {
      trigger,
      start,
      end,
      scrub,
      pin,
      markers,
      ...options.scrollTrigger,
    },
  });
}

export { gsap, ScrollTrigger };

