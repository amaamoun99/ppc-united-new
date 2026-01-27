'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap'; 
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { Plus, Minus } from 'lucide-react'; 

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

const moreClients = [

  { name: 'Osool', logo: '/images/clients/osool.jpeg' },
  { name: 'Bwabet El Re3aia', logo: '/images/clients/bwabet elre3aia.jpeg' },
  { name: 'Ministry of Health', logo: '/images/clients/ministry of health.jpeg' },
  { name: 'Qiddiya', logo: '/images/clients/qiddiya.jpeg' },
  { name: 'Siemens', logo: '/images/clients/siemens.jpeg' },
  { name: 'Dar Al Arkan', logo: '/images/clients/dar elarkan.jpeg' },
  { name: 'Saudi Ceramics', logo: '/images/clients/saudi ceramics.jpeg' },
  { name: 'Beckman Coulter', logo: '/images/clients/beckman.jpeg' },
  { name: 'El Osiem', logo: '/images/clients/elosiem.jpeg' },
  { name: 'El Saedan', logo: '/images/clients/elsaedan.jpeg' },
];

export default function ClientsPartners() {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef(null);
  
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

  // 3. EXPANSION ANIMATION LOGIC
  useEffect(() => {
    if (isExpanded) {
      // Animate new bubbles popping in
      gsap.fromTo(
        '.hidden-bubble',
        { scale: 0, opacity: 0, y: 20 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: {
            amount: 0.8,
            grid: 'auto',
            from: 'center', // Bubbles explode from center
          },
          ease: 'elastic.out(1, 0.5)',
        }
      );
    }
  }, [isExpanded]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <section
      ref={containerRef}
      className="relative pt-32 pb-16 px-4 overflow-hidden bg-gradient-to-b from-blue-500 via-white to-white"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute top-[40%] -left-[10%] w-[500px] h-[500px] bg-purple-200/20 rounded-full blur-3xl" />
      </div>


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
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-semibold text-slate-700 whitespace-nowrap">
                {client.name}
              </div>
            </div>
          ))}

          {/* 2. Hidden Clients (Conditional Render) */}
          {isExpanded &&
            moreClients.map((client, index) => (
              <div
                key={`more-${index}`}
                className="hidden-bubble group relative w-full aspect-square max-w-24 md:max-w-28"
              >
                <div className="client-bubble-inner w-full h-full rounded-full bg-white shadow-[0_8px_30px_-5px_rgba(0,0,0,0.05)] border border-slate-100 flex items-center justify-center p-4 transition-all duration-300 group-hover:scale-110">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image 
                      src={client.logo} 
                      alt={client.name} 
                      fill 
                      className="object-contain p-1 opacity-80" 
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* EXPAND BUTTON */}
        <div className="mt-16">
          <button
            onClick={toggleExpand}
            className="group relative inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative flex items-center gap-2">
              <span>{isExpanded ? 'Show Less' : `View All ${featuredClients.length + moreClients.length} Partners`}</span>
              <div className={`transition-transform duration-500 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
                {isExpanded ? <Minus size={18} /> : <Plus size={18} />}
              </div>
            </div>
          </button>
        </div>

      </div>
    </section>
  );
}