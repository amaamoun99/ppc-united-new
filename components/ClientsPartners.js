'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap'; 
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

// Register GSAP plugin safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// 1. DATA EXTRACTION
const featuredClients = [
  { name: 'Siemens', logo: '/images/clients/siemens.jpeg' },
  { name: 'Dar Al Arkan', logo: '/images/clients/dar elarkan.jpeg' },
  { name: 'Saudi Ceramics', logo: '/images/clients/saudi ceramics.jpeg' },
  { name: 'Beckman Coulter', logo: '/images/clients/beckman.jpeg' },
  { name: 'El Osiem', logo: '/images/clients/elosiem.jpeg' },
  { name: 'El Saedan', logo: '/images/clients/elsaedan.jpeg' },
  { name: 'Osool', logo: '/images/clients/osool.jpeg' },
  { name: 'Bwabet El Re3aia', logo: '/images/clients/bwabet elre3aia.jpeg' },
  { name: 'Ministry of Health', logo: '/images/clients/ministry of health.jpeg' },
  { name: 'Qiddiya', logo: '/images/clients/qiddiya.jpeg' },
];

// Combine all clients for velocity bar (duplicate for seamless loop)
const allClients = [
  { name: 'Siemens', logo: '/images/clients/siemens.jpeg' },
  { name: 'Dar Al Arkan', logo: '/images/clients/dar elarkan.jpeg' },
  { name: 'Saudi Ceramics', logo: '/images/clients/saudi ceramics.jpeg' },
  { name: 'Beckman Coulter', logo: '/images/clients/beckman.jpeg' },
  { name: 'El Osiem', logo: '/images/clients/elosiem.jpeg' },
  { name: 'El Saedan', logo: '/images/clients/elsaedan.jpeg' },
  { name: 'Osool', logo: '/images/clients/osool.jpeg' },
  { name: 'Bwabet El Re3aia', logo: '/images/clients/bwabet elre3aia.jpeg' },
  { name: 'Ministry of Health', logo: '/images/clients/ministry of health.jpeg' },
  { name: 'Qiddiya', logo: '/images/clients/qiddiya.jpeg' },
];

export default function ClientsPartners() {
  const containerRef = useRef(null);
  const velocityBarRef = useRef(null);
  
  // 2. INITIAL ANIMATION (Floating & Entrance)
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the initial featured bubbles
      gsap.fromTo(
        '.featured-bubble',
        { scale: 0, opacity: 0, y: 50 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
          },
        }
      );

      // Continuous floating motion for ALL bubbles
      gsap.to('.client-bubble-inner', {
        y: -10,
        rotation: 2,
        duration: 'random(2, 4)',
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: {
          amount: 2,
          from: 'random',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // 3. VELOCITY BAR ANIMATION
  useEffect(() => {
    if (velocityBarRef.current) {
      const bar = velocityBarRef.current;
      const content = bar.querySelector('.velocity-content');
      
      if (content) {
        // Get the width of the content
        const contentWidth = content.scrollWidth / 2; // Divide by 2 because we duplicate the content
        
        // Create infinite scroll animation
        gsap.to(content, {
          x: -contentWidth,
          duration: 20,
          ease: 'none',
          repeat: -1,
        });
      }
    }
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative pt-32 pb-16 px-4 overflow-hidden bg-gradient-to-b from-blue-500 via-white to-white"
    >
      


      <div className="container mx-auto max-w-7xl relative z-10 text-center">
        {/* Header Section */}
        <div className="mb-16 space-y-4">
          <h2 className=" text-white text-6xl md:text-8xl font-black  tracking-tighter mb-4">
            Partners & <span className="text-blue-600">Clients</span>
          </h2>
         
        </div>

        {/* BUBBLE GRID CONTAINER */}
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-6 justify-items-center perspective-1000 ">
          
          {/* 1. Featured Clients (Always Visible) */}
          {featuredClients.map((client, index) => (
            <div
              key={`featured-${index}`}
              className="featured-bubble group relative w-full aspect-square max-w-28 md:max-w-36 "
            >
              {/* The Floating Inner Container */}
              <div className="client-bubble-inner w-full h-full rounded-full bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 flex items-center justify-center p-6 transition-all duration-300 group-hover:shadow-[0_20px_60px_-15px_rgba(59,130,246,0.2)] group-hover:border-blue-100">
                
                {/* Client Logo */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image 
                    src={client.logo} 
                    alt={client.name} 
                    fill 
                    className="object-contain p-2" 
                  />
                </div>

                {/* Shine Effect */}
                <div className="absolute top-2 right-4 w-6 h-3 bg-white/40 blur-sm rounded-full transform -rotate-45" />
              </div>
              
              {/* Hover Tooltip/Name */}
              {/* <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-semibold text-slate-700 whitespace-nowrap">
                {client.name}
              </div> */}
            </div>
          ))}

        </div>

        {/* VELOCITY BAR */}
        <div 
          ref={velocityBarRef}
          className="mt-20 relative overflow-hidden pb-10"
        >
          <div className="velocity-content flex items-center gap-6 md:gap-8 will-change-transform">
            {/* Duplicate content for seamless loop */}
            {[...allClients, ...allClients].map((client, index) => (
              <div
                key={`velocity-${index}`}
                className="flex-shrink-0 group relative w-20 h-20 md:w-24 md:h-24"
              >
                <div className="w-full h-full rounded-full bg-white shadow-[0_8px_30px_-5px_rgba(0,0,0,0.1)] border border-slate-100 flex items-center justify-center p-2 md:p-3 transition-all duration-300 group-hover:shadow-[0_15px_50px_-10px_rgba(59,130,246,0.3)] group-hover:scale-110">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image 
                      src={client.logo} 
                      alt={client.name} 
                      fill 
                      className="object-contain p-1 md:p-1.5" 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}