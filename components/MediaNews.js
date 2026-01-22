'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import Link from 'next/link';

const newsItems = [
  {
    id: 1,
    title: 'PPC-United Secures Landmark Riyadh Metro Contract',
    excerpt: 'A defining moment for urban infrastructure in the capital.',
    date: '2024-01-15',
    category: 'CONTRACTS'
  },
  {
    id: 2,
    title: 'New Medical Wing: Zero-Carbon Initiative',
    excerpt: 'Pioneering sustainable healthcare construction in Jeddah.',
    date: '2024-02-20',
    category: 'SUSTAINABILITY'
  },
  {
    id: 3,
    title: 'Strategic Partnership with Ministry of Health',
    excerpt: 'Aligning with Vision 2030 to transform national care.',
    date: '2024-03-10',
    category: 'PARTNERSHIP'
  },
];

export default function MediaNews() {
  const sectionRef = useRef(null);
  const marqueeInnerRef = useRef(null);
  const rafIdRef = useRef(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      if (!section) return;
      
      // 2. MARQUEE SCROLL VELOCITY EFFECT
      // The marquee moves by itself, but moves FASTER when user scrolls
      let xPercent = 0;
      let direction = -1;
      
      const animateMarquee = () => {
          if (!marqueeInnerRef.current) return;
          
          if (xPercent <= -100) xPercent = 0;
          if (xPercent > 0) xPercent = -100;
          
          gsap.set(marqueeInnerRef.current, { xPercent: xPercent });
          
          // Base speed
          xPercent += 0.05 * direction; 
          rafIdRef.current = requestAnimationFrame(animateMarquee);
      };
      
      // Add scroll velocity to the marquee speed
      gsap.to(marqueeInnerRef.current, {
          scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              onUpdate: (self) => {
                  // Determine direction based on scroll
                  direction = self.direction === 1 ? -1 : 1;
                  // Add velocity (making it surge when scrolling)
                  xPercent += self.getVelocity() * 0.0005 * direction;
              }
          }
      });
      
      rafIdRef.current = requestAnimationFrame(animateMarquee);

    }, sectionRef);

    // Cleanup function
    return () => {
      // Cancel animation frame if it exists
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      // Only revert the context (which will clean up its own ScrollTriggers)
      ctx.revert();
    };
  }, []);

  return (
    <section 
        ref={sectionRef} 
        className="py-32 pb-0 relative z-10 overflow-hidden border-t border-blue-500/20 bg-gradient-to-b from-blue-800 via-blue-900 to-blue-950"
        style={{ isolation: 'isolate' }}
    >
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header Layout */}
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-20 border-b border-blue-500/20 pb-8">
            <h2 className="text-7xl font-black tracking-tighter text-white">
                NEWS<span className="text-blue-400">.</span>
            </h2>
            <div className="flex items-center gap-4 text-blue-300/70 text-sm font-mono uppercase tracking-widest mt-6 md:mt-0">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                Company Updates
            </div>
        </div>

        {/* --- DYNAMIC NEWS GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-12">
            {newsItems.map((item, index) => (
                <SpotlightCard key={item.id} item={item} index={index} />
            ))}
        </div>

        {/* --- CTA BUTTON --- */}
        <div className="m-20 flex justify-center">
          <ViewAllNewsButton />
        </div>
      </div>

      {/* --- BACKGROUND DECORATION --- */}
      {/* Giant Marquee Text running behind content with logo pattern */}
      <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 opacity-[0.03] pointer-events-none select-none">
          <div ref={marqueeInnerRef} className="whitespace-nowrap flex gap-10">
              {[...Array(4)].map((_, i) => (
                 <span key={i} className="text-[20vw] font-black leading-none text-blue-400">
                     PRESS • RELEASES • MEDIA • PPC-UNITED • 
                 </span>
              ))}
          </div>
      </div>

    </section>
  );
}

// --- SUB-COMPONENT: SPOTLIGHT CARD ---
function SpotlightCard({ item, index }) {
    const cardRef = useRef(null);

    // Mouse tracking for Spotlight effect
    const handleMouseMove = (e) => {
        const { left, top } = cardRef.current.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        cardRef.current.style.setProperty("--mouse-x", `${x}px`);
        cardRef.current.style.setProperty("--mouse-y", `${y}px`);
    };

    return (
        <article 
            ref={cardRef}
            onMouseMove={handleMouseMove}
            className="group relative bg-blue-900/30 rounded-none border border-blue-500/20 p-8 overflow-hidden transition-colors hover:bg-blue-900/50"
        >
            {/* The Spotlight Gradient Overlay with Blue */}
            <div 
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(0,168,255,0.15), transparent 40%)`
                }}
            />
            
            {/* Date Badge */}
            <div className="flex justify-between items-start mb-8 opacity-70">
                <span className="font-mono text-xs border border-blue-400/30 px-2 py-1 rounded text-blue-300">
                    {item.category}
                </span>
                <span className="font-mono text-xs text-blue-200">
                    {item.date}
                </span>
            </div>

            {/* Content */}
            <div className="relative z-10 space-y-4">
                <h3 className="text-3xl font-bold text-white leading-tight group-hover:text-blue-400 transition-colors duration-300">
                    {item.title}
                </h3>
                <p className="text-lg text-blue-200/80 leading-relaxed border-l-2 border-blue-500/30 pl-4 group-hover:border-blue-400 transition-colors">
                    {item.excerpt}
                </p>
            </div>

            {/* Bottom Interaction */}
            <div className="mt-12 flex items-center gap-4 text-white font-bold tracking-widest text-sm group/btn cursor-pointer">
                <span className="relative overflow-hidden">
                   READ ARTICLE
                   <span className="absolute bottom-0 left-0 w-full h-[1px] bg-blue-400 transform -translate-x-100 group-hover/btn:translate-x-0 transition-transform duration-300"></span>
                </span>
                <span className="transform group-hover/btn:translate-x-2 transition-transform duration-300">→</span>
            </div>
        </article>
    );
}

// --- CTA BUTTON COMPONENT ---
function ViewAllNewsButton() {
  const buttonRef = useRef(null);
  const textRef = useRef(null);
  const arrowRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseEnter = () => {
      gsap.to(textRef.current, { 
        x: -10, 
        duration: 0.3, 
        ease: 'power2.out' 
      });
      gsap.fromTo(arrowRef.current, 
        { x: -30, opacity: 0, rotation: -45 },
        { x: 0, opacity: 1, rotation: 0, duration: 0.4, ease: 'back.out(1.7)', delay: 0.1 }
      );
      gsap.to(glowRef.current, { 
        opacity: 1, 
        scale: 1.2, 
        duration: 0.4, 
        ease: 'power2.out' 
      });
    };

    const handleMouseLeave = () => {
      gsap.to(textRef.current, { 
        x: 0, 
        duration: 0.3, 
        ease: 'power2.out' 
      });
      gsap.to(arrowRef.current, { 
        x: -30, 
        opacity: 0, 
        rotation: -45, 
        duration: 0.3, 
        ease: 'power2.in' 
      });
      gsap.to(glowRef.current, { 
        opacity: 0, 
        scale: 1, 
        duration: 0.3, 
        ease: 'power2.out' 
      });
    };

    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <Link href="/contact">
      <button
        ref={buttonRef}
        className="group/btn relative overflow-hidden bg-blue-900/40 backdrop-blur-md border border-blue-500/30 text-white px-10 py-4 rounded-full font-bold text-base tracking-widest uppercase transition-all duration-300 hover:bg-blue-800/50 hover:border-blue-400/50"
      >
        {/* Glow Effect */}
        <span
          ref={glowRef}
          className="absolute inset-0 bg-blue-400/30 blur-xl opacity-0 transition-opacity duration-300"
        />
        
        {/* Button Content */}
        <span className="relative flex items-center gap-4 z-10">
          <span ref={textRef} className="inline-block">View All News</span>
          <span 
            ref={arrowRef}
            className="inline-block opacity-0 -translate-x-8 transition-transform duration-300"
          >
            →
          </span>
        </span>
        
        {/* Animated Border */}
        <span className="absolute inset-0 rounded-full border-2 border-blue-400/0 group-hover/btn:border-blue-400/50 transition-colors duration-300" />
      </button>
    </Link>
  );
}