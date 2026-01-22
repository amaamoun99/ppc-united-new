'use client';

import { useEffect, useRef, useLayoutEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import Image from 'next/image';

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

  // --- HORIZONTAL SCROLL LOGIC ---
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
        
        // 1. Horizontal Scroll for Timeline
        const totalWidth = timelineTrackRef.current.scrollWidth;
        const windowWidth = window.innerWidth;
        
        gsap.to(timelineTrackRef.current, {
            x: () => -(totalWidth - windowWidth),
            ease: "none",
            scrollTrigger: {
                trigger: timelineContainerRef.current,
                pin: true,
                scrub: 1,
                end: () => "+=" + totalWidth, // Scroll distance matches width
            }
        });

        // 2. Parallax Text Entrance
        gsap.fromTo(".about-hero-text",
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.1, duration: 1, ease: "power4.out" }
        );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-stone-50 min-h-screen overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <div className="container mx-auto px-6 py-32 md:py-48">
         <h1 className="about-hero-text text-7xl md:text-9xl font-black text-stone-900 tracking-tighter mb-8 leading-[0.85]">
            BUILDING <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-dark">LEGACY.</span>
         </h1>
         <p className="about-hero-text text-xl md:text-2xl text-stone-500 max-w-2xl font-light leading-relaxed">
            Since 2010, PPC-United has been the silent force behind Saudi Arabia's most complex infrastructure. We don't just engineer systems; we engineer trust.
         </p>
      </div>

      {/* 2. HORIZONTAL TIMELINE SECTION */}
      <div ref={timelineContainerRef} className="h-screen bg-stone-900 text-white flex items-center overflow-hidden relative">
         <div className="absolute top-12 left-12 text-stone-500 font-mono text-sm uppercase tracking-widest">
            Our History
         </div>
         
         {/* The Track that moves left */}
         <div ref={timelineTrackRef} className="flex gap-24 px-12 md:px-24 items-center">
            {milestones.map((milestone, i) => (
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
            {/* End Buffer */}
            <div className="w-[20vw]" />
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

// --- SUB-COMPONENT: TEAM MEMBER (Lens Effect) ---
function TeamMember({ member }) {
  const containerRef = useRef(null);
  const colorImageRef = useRef(null); // The color image layer
  
  const handleMouseMove = (e) => {
    if(!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    // Move the mask (Reveal color image)
    gsap.to(colorImageRef.current, {
        css: { 
            WebkitMaskPosition: `${x - 100}px ${y - 100}px`, // Center 200px mask
            maskPosition: `${x - 100}px ${y - 100}px` 
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
            className="relative w-full aspect-[3/4] overflow-hidden rounded-xl bg-stone-200 cursor-crosshair group mb-8"
        >
            {/* LAYER 1: Black & White Image (Always Visible) */}
            <img 
                src={member.image} 
                alt={member.name}
                className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-125"
            />

            {/* LAYER 2: Color Image (Hidden by Mask) */}
            <div 
                ref={colorImageRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{
                    WebkitMaskImage: "radial-gradient(circle 100px at center, black 100%, transparent 100%)",
                    maskImage: "radial-gradient(circle 100px at center, black 100%, transparent 100%)",
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                    WebkitMaskPosition: "-200px -200px", // Start hidden
                    maskPosition: "-200px -200px"
                }}
            >
                <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Optional: Lens Border UI */}
            <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity">
                INSPECT
            </div>
        </div>

        <h3 className="text-2xl font-bold text-stone-900">{member.name}</h3>
        <p className="text-stone-500 font-mono uppercase text-sm tracking-widest mt-2">{member.role}</p>
    </div>
  );
}