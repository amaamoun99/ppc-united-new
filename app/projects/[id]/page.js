'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { gsap } from '@/lib/gsap'; // Ensure this path is correct
import Link from 'next/link';
import Image from 'next/image'; // Optimized Next.js Image

// === Stable Project Data (High Quality Pexels) ===
const projectsData = [
  {
    id: 1,
    name: 'Riyadh Hospital Complex',
    location: 'Riyadh, KSA',
    year: 2024,
    category: 'medical',
    description: 'A state-of-the-art medical facility focused on patient wellness and sustainable architecture. Features include automated MEP systems and sterile environment finishing.',
    images: [
      'https://images.pexels.com/photos/269077/pexels-photo-269077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/668300/pexels-photo-668300.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    ]
  },
  {
    id: 2,
    name: 'Jeddah Commercial Tower',
    location: 'Jeddah, KSA',
    year: 2023,
    category: 'mep',
    description: 'A 60-story commercial tower requiring complex HVAC, electrical, and plumbing solutions integrated into a modern glass facade.',
    images: [
       'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
       'https://images.pexels.com/photos/443383/pexels-photo-443383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
       'https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    ]
  },
  {
    id: 3,
    name: 'Luxury Villa Finishing',
    location: 'Riyadh Diplomatic Quarter',
    year: 2024,
    category: 'finishing',
    description: 'High-end residential finishing involving imported marble flooring, custom joinery, and smart home integration.',
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/3797991/pexels-photo-3797991.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    ]
  },
  {
    id: 4,
    name: 'Office Complex MEP',
    location: 'Riyadh',
    year: 2023,
    category: 'mep',
    description: 'Integrated mechanical and electrical systems for a multi-building office park, focusing on energy efficiency.',
    images: [
      'https://images.pexels.com/photos/443383/pexels-photo-443383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/1106476/pexels-photo-1106476.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    ]
  },
  {
    id: 5,
    name: 'Residential Finishing',
    location: 'Jeddah',
    year: 2024,
    category: 'finishing',
    description: 'Modern apartment complex finishing, delivering clean lines, premium fixtures, and durable materials.',
    images: [
      'https://images.pexels.com/photos/3797991/pexels-photo-3797991.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    ]
  },
];

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const containerRef = useRef(null);
  const mainImageRef = useRef(null);

  // Find the project by ID
  const project = projectsData.find(p => p.id === parseInt(params.id));

  // 1. ENTRANCE ANIMATION (Simulates the transition)
  useEffect(() => {
    if (!containerRef.current || !project) return;

    const tl = gsap.timeline();

    // A. Fade in page
    tl.to(containerRef.current, { opacity: 1, duration: 0.5 });

    // B. Expand Main Image (Scale Up Effect)
    tl.fromTo(mainImageRef.current,
        { scale: 1.1, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: 'power3.out' }
    );

    // C. Slide up content (Staggered)
    tl.fromTo('.animate-in',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power3.out' },
      '-=0.6'
    );

    return () => tl.kill();
  }, [project]);

  // 2. THUMBNAIL SWAP ANIMATION
  const changeActiveImage = (index) => {
    if (index === activeImageIndex || !mainImageRef.current) return;

    // Crossfade Logic
    gsap.to(mainImageRef.current, {
      opacity: 0,
      scale: 1.05,
      duration: 0.2,
      onComplete: () => {
        setActiveImageIndex(index);
        gsap.to(mainImageRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: 'power2.out'
        });
      }
    });
  };

  // 3. BACK NAVIGATION ANIMATION
  const handleBack = () => {
    // Fade out page before pushing route
    gsap.to(containerRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.3,
      onComplete: () => router.push('/projects')
    });
  };

  if (!project) return null;

  return (
    <div ref={containerRef} className="min-h-screen bg-stone-50 opacity-0"> {/* Start hidden for fade-in */}
      
      {/* --- FLOATING NAVIGATION --- */}
      <nav className="fixed top-8 left-0 w-full z-50 px-6 md:px-12 flex justify-between items-start pointer-events-none">
          {/* Back Button */}
          <button 
            onClick={handleBack}
            className="pointer-events-auto bg-white/80 backdrop-blur-md border border-white/20 text-stone-900 px-6 py-3 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-stone-900 hover:text-white transition-colors shadow-lg flex items-center gap-2 group"
          >
            <span>←</span> Back
          </button>

          {/* Close Icon (Alternative) */}
          <button 
            onClick={handleBack}
            className="pointer-events-auto w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors shadow-lg"
          >
            ✕
          </button>
      </nav>


      <div className="container mx-auto px-6 py-24 md:py-32">
        
        {/* --- TOP SECTION: GALLERY GRID --- */}
        {/* 12-Column Grid: 9 for Main Image, 3 for Thumbnails */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-20 h-[60vh] lg:h-[700px]">
          
          {/* MAIN IMAGE */}
          <div className="lg:col-span-9 relative rounded-2xl overflow-hidden bg-stone-200 shadow-2xl group">
             <Image
                ref={mainImageRef}
                src={project.images[activeImageIndex]}
                alt={project.name}
                fill
                className="object-cover will-change-transform"
                priority
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
             
             {/* Hero Title Overlay */}
             <div className="animate-in absolute bottom-8 left-8 md:bottom-12 md:left-12 text-white p-4">
                <span className="inline-block px-3 py-1 border border-white/30 rounded-full bg-black/20 backdrop-blur-md text-xs font-mono uppercase tracking-widest mb-4">
                    {project.category}
                </span>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-none">
                    {project.name}
                </h1>
             </div>
          </div>

          {/* THUMBNAILS (Vertical Stack) */}
          <div className="lg:col-span-3 flex flex-row lg:flex-col gap-4 h-full">
             {project.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => changeActiveImage(index)}
                  className={`animate-in relative flex-1 rounded-xl overflow-hidden transition-all duration-300 group ${
                    activeImageIndex === index 
                      ? 'ring-2 ring-stone-900 ring-offset-2 opacity-100' 
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image 
                    src={img} 
                    alt={`View ${index + 1}`} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                </button>
             ))}
          </div>
        </div>


        {/* --- BOTTOM SECTION: DETAILS & CONTENT --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">
            
            {/* LEFT COLUMN: SPECS */}
            <div className="animate-in md:col-span-4 space-y-8 border-t border-stone-200 pt-8">
                <h3 className="text-sm font-mono uppercase tracking-widest text-stone-400">Project Specs</h3>
                
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <span className="block text-xs uppercase text-stone-500 mb-1">Location</span>
                        <p className="text-xl font-bold text-stone-900">{project.location}</p>
                    </div>
                    <div>
                        <span className="block text-xs uppercase text-stone-500 mb-1">Year</span>
                        <p className="text-xl font-bold text-stone-900">{project.year}</p>
                    </div>
                    <div>
                        <span className="block text-xs uppercase text-stone-500 mb-1">Scope</span>
                        <p className="text-xl font-bold text-stone-900 capitalize">{project.category} Engineering</p>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: DESCRIPTION */}
            <div className="animate-in md:col-span-8 border-t border-stone-200 pt-8">
                 <h3 className="text-sm font-mono uppercase tracking-widest text-stone-400 mb-6">The Concept</h3>
                 <p className="text-2xl md:text-3xl font-serif italic text-stone-800 leading-relaxed mb-8">
                    "{project.description}"
                 </p>
                 <div className="text-lg text-stone-600 space-y-6 leading-relaxed">
                    <p>
                        Our team approached this project with a focus on precision and sustainability. 
                        By utilizing advanced BIM modeling, we ensured that every MEP system integrated 
                        flawlessly with the architectural vision.
                    </p>
                    <p>
                        The result is a facility that not only meets international standards but sets a new 
                        benchmark for {project.category} construction in the region.
                    </p>
                 </div>

                 {/* CTA */}
                 <div className="mt-12">
                    <Link 
                        href="/contact"
                        className="inline-flex items-center gap-4 text-stone-900 font-bold uppercase tracking-widest hover:gap-6 transition-all group"
                    >
                        Start a Project Like This <span className="text-2xl group-hover:text-brand">→</span>
                    </Link>
                 </div>
            </div>
        </div>

      </div>
    </div>
  );
}