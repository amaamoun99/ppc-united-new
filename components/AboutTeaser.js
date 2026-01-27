'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Register GSAP plugin safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutTeaser() {
  const containerRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // 1. Staggered Text Reveal
      const elements = containerRef.current.querySelectorAll('.reveal-text');
      
      gsap.fromTo(elements, 
        { y: 100, opacity: 0, skewY: 5 },
        {
          y: 0,
          opacity: 1,
          skewY: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
          }
        }
      );

      // 2. Line Expansion Animation
      gsap.fromTo('.divider-line',
        { scaleX: 0, transformOrigin: 'left' },
        {
          scaleX: 1,
          duration: 1.5,
          ease: 'expo.out',
          delay: 0.2,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
          }
        }
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative bg-white py-20 px-4 md:px-8 overflow-hidden z-20"
    >
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row items-end justify-between gap-10 lg:gap-20">
          
          {/* --- LEFT: BIG BOLD TYPOGRAPHY --- */}
          <div className="w-full lg:w-3/5 relative">
            <div className="overflow-hidden">
                <h2 className="reveal-text text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                  PRECISION
                </h2>
            </div>
            <div className="overflow-hidden">
                <h2 className="reveal-text text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 tracking-tighter leading-[0.9]">
                  IN MOTION.
                </h2>
            </div>
          </div>

          {/* --- RIGHT: CONTENT & CTA --- */}
          <div className="w-full lg:w-2/5 pb-2">
            <div className="overflow-hidden mb-8">
              <p className="reveal-text text-lg md:text-xl text-slate-600 font-medium leading-relaxed max-w-md">
                We bridge the gap between complex <span className="text-slate-900 font-bold">MEP engineering</span> and sterile <span className="text-slate-900 font-bold">medical finishing</span>.
              </p>
            </div>

            {/* Styled Button */}
            <div className="reveal-text">
                <Link 
                  href="/about" 
                  ref={buttonRef}
                  className="group inline-flex items-center gap-4 text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors duration-300"
                >
                  <span className="relative">
                    WHO WE ARE
                    {/* Underline animation */}
                    <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </span>
                  
                  {/* Circular Icon Wrapper */}
                  <div className="relative w-12 h-12 rounded-full border-2 border-slate-200 flex items-center justify-center overflow-hidden group-hover:border-blue-600 transition-colors duration-300">
                    <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <ArrowRight className="w-5 h-5 relative z-10 text-slate-900 group-hover:text-white transition-colors duration-300" />
                  </div>
                </Link>
            </div>
          </div>
        </div>

        {/* --- DECORATIVE DIVIDER --- */}
        <div className="mt-16 relative h-[2px] w-full bg-slate-100 overflow-hidden">
           <div className="divider-line absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-400 to-transparent w-full h-full" />
        </div>
      </div>
    </section>
  );
}