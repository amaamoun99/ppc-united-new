'use client';

import { useRef, useLayoutEffect } from 'react';
import { gsap } from '@/lib/gsap';
import { useMediaQuery } from '@/hooks/useMediaQuery';


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
    year: 'now',
    description: 'Leading projects supporting Saudi Arabia\'s ambitious development goals.',
  },
];

const teamMembers = [
    { id: 1, name: "Ahmed Al-Farsi", role: "Chief Executive Officer", image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: 2, name: "Sarah Johnson", role: "Head of Engineering", image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: 3, name: "Khalid Otaibi", role: "Operations Director", image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=600" },
];

export default function AboutPage() {
  const containerRef = useRef(null);
  const timelineContainerRef = useRef(null);
  const timelineTrackRef = useRef(null);
  const { isMobile } = useMediaQuery();

  // --- HORIZONTAL SCROLL (desktop only) + HERO TEXT ENTRANCE ---
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Hero text entrance (all viewports)
      gsap.fromTo(".about-hero-text",
        { y: isMobile ? 40 : 100, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: isMobile ? 0.6 : 1, ease: "power4.out" }
      );

      if (!isMobile && timelineTrackRef.current && timelineContainerRef.current) {
        const totalWidth = timelineTrackRef.current.scrollWidth;
        const windowWidth = window.innerWidth;
        gsap.to(timelineTrackRef.current, {
          x: () => -(totalWidth - windowWidth),
          ease: "none",
          scrollTrigger: {
            trigger: timelineContainerRef.current,
            pin: true,
            scrub: 1,
            end: () => "+=" + totalWidth,
          }
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <div ref={containerRef} className="bg-stone-50 min-h-screen overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <div className="container mx-auto px-6 py-24 md:py-32 lg:py-48">
         <h1 className="about-hero-text text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-black text-stone-900 tracking-tighter mb-8 leading-[0.85]">
            BUILDING <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-dark">LEGACY.</span>
         </h1>
         <p className="about-hero-text text-lg md:text-xl lg:text-2xl text-stone-500 max-w-2xl font-light leading-relaxed">
            Since 2010, PPC-United has been the silent force behind Saudi Arabia's most complex infrastructure. We don't just engineer systems; we engineer trust.
         </p>
      </div>

      {/* 2. TIMELINE: vertical on mobile, horizontal scroll on desktop */}
      {/* Mobile: vertical list */}
      <div className="md:hidden bg-stone-900 text-white py-16 px-6">
        <div className="text-stone-500 font-mono text-sm uppercase tracking-widest mb-12">Our History</div>
        <div className="space-y-12">
          {milestones.map((milestone) => (
            <div key={milestone.id} className="border-l-2 border-white/20 pl-6">
              <span className="text-4xl font-black text-brand block mb-2">{milestone.year}</span>
              <h3 className="text-xl font-bold mb-2 text-white">{milestone.title}</h3>
              <p className="text-stone-400 leading-relaxed">{milestone.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: horizontal scroll */}
      <div ref={timelineContainerRef} className="hidden md:block h-screen bg-stone-900 text-white overflow-hidden relative">
         <div className="absolute top-12 left-12 text-stone-500 font-mono text-sm uppercase tracking-widest z-10">
            Our History
         </div>
         <div className="h-full w-full flex items-center justify-start overflow-hidden">
         <div ref={timelineTrackRef} className="flex gap-24 px-12 md:px-24 items-center self-center flex-shrink-0">
            {milestones.map((milestone) => (
                <div key={milestone.id} className="w-[400px] md:w-[600px] flex-shrink-0 group">
                    <div className="border-t border-white/20 pt-8 mb-8 group-hover:border-brand transition-colors duration-500 w-full" />
                    <span className="text-9xl font-black text-white/10 group-hover:text-white transition-colors duration-500 block mb-4">
                        {milestone.year}
                    </span>
                    <h3 className="text-3xl font-bold mb-4 text-brand">
                        {milestone.title}
                    </h3>
                    <p className="text-xl text-stone-400 leading-relaxed">
                        {milestone.description}
                    </p>
                </div>
            ))}
            <div className="w-[20vw]" />
         </div>
         </div>
      </div>

      {/* 3. TEAM SECTION */}
      <div className="py-32 container mx-auto px-6">
         <h2 className="text-5xl md:text-7xl font-bold text-stone-900 mb-24 text-center tracking-tighter">
            THE <span className="italic font-serif text-brand">Visionaries</span>
         </h2>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {teamMembers.map((member) => (
                <TeamMember key={member.id} member={member} />
            ))}
         </div>
      </div>

    </div>
  );
}

// --- SUB-COMPONENT: TEAM MEMBER (Lens effect on desktop only; plain image on mobile/touch) ---
function TeamMember({ member }) {
  const containerRef = useRef(null);
  const colorImageRef = useRef(null);
  const { isMobile, isTouch } = useMediaQuery();
  const useLens = !isMobile && !isTouch;

  const handleMouseMove = (e) => {
    if (!useLens || !containerRef.current || !colorImageRef.current) return;
    const { left, top } = containerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const lensRadius = 140;
    gsap.to(colorImageRef.current, {
      css: {
        WebkitMaskPosition: `${x - lensRadius}px ${y - lensRadius}px`,
        maskPosition: `${x - lensRadius}px ${y - lensRadius}px`
      },
      duration: 0.1,
      ease: "power1.out"
    });
  };

  return (
    <div className="flex flex-col items-center">
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className={`relative w-full aspect-[3/4] overflow-hidden rounded-xl bg-stone-200 group mb-8 ${useLens ? 'cursor-crosshair' : ''}`}
        >
            {/* Desktop with lens: grayscale bg + masked color layer */}
            {useLens && (
              <img
                src={member.image}
                alt=""
                aria-hidden
                className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-125"
              />
            )}
            {/* Color image: masked on desktop (lens), full on mobile */}
            <div
                ref={colorImageRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={useLens ? {
                    WebkitMaskImage: "radial-gradient(circle 140px at center, black 100%, transparent 100%)",
                    maskImage: "radial-gradient(circle 140px at center, black 100%, transparent 100%)",
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                    WebkitMaskPosition: "-280px -280px",
                    maskPosition: "-280px -280px"
                } : {}}
            >
                <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                />
            </div>
        </div>

        <h3 className="text-2xl font-bold text-stone-900">{member.name}</h3>
        <p className="text-stone-500 font-mono uppercase text-sm tracking-widest mt-2">{member.role}</p>
    </div>
  );
}