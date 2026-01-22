'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

const milestones = [
  {
    id: 1,
    title: 'Founded',
    year: '2010',
    description: 'PPC-United was established with a vision to revolutionize engineering in Saudi Arabia.',
  },
  {
    id: 2,
    title: 'First Major MEP Project',
    year: '2015',
    description: 'Completed landmark MEP installation for a major commercial complex in Riyadh.',
  },
  {
    id: 3,
    title: 'Expansion to Medical Sector',
    year: '2020',
    description: 'Launched specialized division for healthcare infrastructure and medical facilities.',
  },
  {
    id: 4,
    title: 'Vision 2030 Partnership',
    year: '2024',
    description: 'Leading projects supporting Saudi Arabia&apos;s ambitious development goals.',
  },
];

export default function HorizontalTimeline() {
  const triggerRef = useRef(null);
  const trackRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const trigger = triggerRef.current;
      const track = trackRef.current;
      
      if (!trigger || !track) return;

      const getScrollAmount = () => {
        const trackWidth = track.scrollWidth;
        const windowWidth = window.innerWidth;
        return trackWidth - windowWidth;
      };

      // Horizontal scroll tween - similar to Services component structure
      const scrollTween = gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: trigger,
          start: "top top",
          end: () => `+=${getScrollAmount()}`,
          pin: true,
          pinSpacing: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        }
      });

    }, triggerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={triggerRef} 
      className="relative overflow-hidden z-20 bg-stone-900"
    >
      {/* Main Container - similar structure to Services */}
      <div ref={containerRef} className="h-screen flex items-center relative overflow-hidden">
        
        {/* Background Label */}
        <div className="absolute top-12 left-6 md:left-12 text-stone-600 font-mono text-sm uppercase tracking-widest z-10 pointer-events-none">
          Our History
        </div>
        
        {/* The Track that scrolls horizontally */}
        <div ref={trackRef} className="flex gap-12 md:gap-24 px-6 md:px-24 items-center min-w-max">
          
          {/* Intro Card */}
          <div className="w-[300px] md:w-[400px] flex-shrink-0 text-white">
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
              A Decade of <br/> <span className="text-brand">Excellence.</span>
            </h2>
            <p className="text-stone-400 mt-6 text-lg max-w-xs">
              From humble beginnings to kingdom-wide infrastructure.
            </p>
          </div>

          {/* Milestone Cards */}
          {milestones.map((milestone) => (
            <div key={milestone.id} className="w-[350px] md:w-[500px] flex-shrink-0 group relative">
              <div className="absolute -top-12 left-0 w-full h-[1px] bg-white/20 group-hover:bg-brand transition-colors duration-500">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-brand rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
              </div>
              
              <span className="text-8xl md:text-9xl font-black text-white/5 group-hover:text-white/10 transition-colors duration-500 block mb-6 select-none -ml-2">
                {milestone.year}
              </span>
              
              <div className="relative pl-6 border-l border-white/20 group-hover:border-brand transition-colors duration-300">
                <h3 className="text-3xl font-bold mb-3 text-white group-hover:text-brand transition-colors">
                  {milestone.title}
                </h3>
                <p className="text-lg text-stone-400 leading-relaxed">
                  {milestone.description}
                </p>
              </div>
            </div>
          ))}

          {/* End Buffer */}
          <div className="w-[20vw]" />
        </div>
      </div>
    </section>
  );
}