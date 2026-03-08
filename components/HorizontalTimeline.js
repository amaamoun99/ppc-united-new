'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const milestones = [
  {
    id: 1,
    title: 'Founded',
    year: '2018',
    description: 'PPC-United was established with a vision to revolutionize engineering in Saudi Arabia.',
  },
  {
    id: 2,
    title: 'First Major MEP Project',
    year: '2019',
    description: 'Completed landmark MEP installation for a major commercial complex in Riyadh.',
  },
  {
    id: 3,
    title: 'Expansion to Medical Sector',
    year: '2023',
    description: 'Launched specialized division for healthcare infrastructure and medical facilities.',
  },
  {
    id: 4,
    title: 'Vision 2030 Partnership',
    year: 'now',
    description: 'Leading projects supporting Saudi Arabia&apos;s ambitious development goals.',
  },
];

export default function HorizontalTimeline() {
  const triggerRef = useRef(null);
  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const { isMobile } = useMediaQuery();

  useEffect(() => {
    if (isMobile) return; // Vertical layout on mobile; no horizontal scroll

    const ctx = gsap.context(() => {
      const trigger = triggerRef.current;
      const track = trackRef.current;

      if (!trigger || !track) return;

      const getScrollAmount = () => {
        const trackWidth = track.scrollWidth;
        const windowWidth = window.innerWidth;
        return trackWidth - windowWidth;
      };

      gsap.to(track, {
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
  }, [isMobile]);

  return (
    <section
      ref={triggerRef}
      className="relative overflow-hidden z-20 bg-gradient-to-b from-white via-blue-700 to-blue-800"
    >
      {/* Mobile: Vertical timeline list */}
      <div className="md:hidden py-16 px-6 space-y-12">
        <div className="text-white max-w-md">
          <h2 className="text-4xl font-bold leading-tight">
            A Decade of <br /> <span className="text-blue-400">Excellence.</span>
          </h2>
          <p className="text-[rgba(219,239,255,0.8)] mt-4 text-lg">
            From humble beginnings to kingdom-wide infrastructure.
          </p>
        </div>
        {milestones.map((milestone) => (
          <div key={milestone.id} className="text-white border-l-2 border-white/20 pl-6 py-2">
            <span className="text-4xl font-black text-blue-400 block mb-2">{milestone.year}</span>
            <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
            <p className="text-blue-200/80 leading-relaxed">{milestone.description}</p>
          </div>
        ))}
      </div>

      {/* Desktop: Main Container - horizontal scroll */}
      <div ref={containerRef} className="hidden md:flex h-screen items-center relative overflow-hidden">
        
        {/* Background Label */}
        <div className="absolute top-12 left-6 md:left-12 text-blue-300/60 font-mono text-sm uppercase tracking-widest z-10 pointer-events-none">
          Our History
        </div>
        
        {/* The Track that scrolls horizontally (desktop only) */}
        <div ref={trackRef} className="flex gap-12 md:gap-24 px-6 md:px-24 items-center min-w-max">
          
          {/* Intro Card */}
          <div className="w-[300px] md:w-[400px] flex-shrink-0 text-white">
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
              A Decade of <br/> <span className="text-blue-400">Excellence.</span>
            </h2>
            <p className="text-blue-200/80 mt-6 text-lg max-w-xs">
              From humble beginnings to kingdom-wide infrastructure.
            </p>
          </div>

          {/* Milestone Cards */}
          {milestones.map((milestone) => (
            <div key={milestone.id} className="w-[350px] md:w-[500px] flex-shrink-0 group relative">
              <div className="absolute -top-12 left-0 w-full h-[1px] bg-white/20 group-hover:bg-blue-400 transition-colors duration-500">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
              </div>
              
              <span className="text-8xl md:text-9xl font-black text-white group-hover:text-blue-400 transition-colors duration-500 block mb-6 select-none -ml-2">
                {milestone.year}
              </span>
              
              <div className="relative pl-6 border-l border-white/20 group-hover:border-blue-400 transition-colors duration-300">
                <h3 className="text-3xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">
                  {milestone.title}
                </h3>
                <p className="text-lg text-blue-200/80 leading-relaxed">
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