'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ReactLenis } from '@studio-freight/react-lenis'; // Import Smooth Scroll
import Image from 'next/image';
import Link from 'next/link';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const projects = [
  { 
    id: 1, 
    title: 'Riyadh Medical City', 
    category: 'Medical', 
    image: 'https://images.pexels.com/photos/269077/pexels-photo-269077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 
    year: '2025' 
  },
  { 
    id: 2, 
    title: 'Jeddah Tower', 
    category: 'MEP', 
    image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 
    year: '2024' 
  },
  { 
    id: 3, 
    title: 'Royal Villa', 
    category: 'Finishing', 
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 
    year: '2024' 
  },
  { 
    id: 4, 
    title: 'Al Khobar Clinic', 
    category: 'Medical', 
    image: 'https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 
    year: '2025' 
  },
  { 
    id: 5, 
    title: 'Finance Plaza', 
    category: 'MEP', 
    image: 'https://images.pexels.com/photos/443383/pexels-photo-443383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 
    year: '2023' 
  },
  { 
    id: 6, 
    title: 'Skyline Penthouse', 
    category: 'Finishing', 
    image: 'https://images.pexels.com/photos/3797991/pexels-photo-3797991.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 
    year: '2025' 
  },
];

const categories = ['All', 'MEP', 'Finishing', 'Medical'];

export default function LatestProjects() {
  const [activeCategory, setActiveCategory] = useState('All');
  const containerRef = useRef(null);
  const cursorRef = useRef(null);
  const cursorLabelRef = useRef(null);
  const projectRefs = useRef([]); // To store refs for parallax

  const filteredProjects = useMemo(() => {
    return activeCategory === 'All' 
      ? projects 
      : projects.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  // 1. Entrance Animation & Parallax Setup
  useEffect(() => {
    const ctx = gsap.context(() => {
      // A. The "No Gravity" Entrance
      gsap.fromTo('.project-card', 
        { y: 100, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1.2, 
          stagger: 0.15, 
          ease: 'power4.out', // Smoother, deeper ease
          clearProps: 'opacity, transform' // Keep opacity but clear transform for parallax to take over
        }
      );

      // B. The Parallax Effect (Image moves inside card)
      // Wait a tick for layout to settle
      setTimeout(() => {
        const cards = document.querySelectorAll('.project-card-trigger');
        cards.forEach((card) => {
          const image = card.querySelector('img');
          
          // Reset image position first
          gsap.set(image, { scale: 1.2, y: '-15%' });

          gsap.to(image, {
            y: '15%', // Move image down as we scroll down
            ease: 'none', // Linear ease is crucial for parallax syncing
            scrollTrigger: {
              trigger: card,
              start: 'top bottom', // When card top hits viewport bottom
              end: 'bottom top',   // When card bottom hits viewport top
              scrub: true,         // Links animation to scrollbar
            }
          });
        });
      }, 100);

    }, containerRef);

    return () => ctx.revert();
  }, [activeCategory, filteredProjects]); // Re-run when category changes

  // 2. Custom Cursor Logic (Kept your existing logic, slightly tuned)
  useEffect(() => {
    const cursor = cursorRef.current;
    const label = cursorLabelRef.current;

    const moveCursor = (e) => {
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.6, ease: 'power3.out' }); // Slower duration = more "floaty"
    };

    const hoverCard = () => {
      gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.2)' });
      gsap.to(label, { opacity: 1, duration: 0.3 });
    };

    const leaveCard = () => {
      gsap.to(cursor, { scale: 0, opacity: 0, duration: 0.3 });
      gsap.to(label, { opacity: 0, duration: 0.3 });
    };

    const cards = document.querySelectorAll('.project-card-trigger');
    cards.forEach(card => {
        card.addEventListener('mouseenter', hoverCard);
        card.addEventListener('mouseleave', leaveCard);
    });

    window.addEventListener('mousemove', moveCursor);
    return () => {
        window.removeEventListener('mousemove', moveCursor);
        cards.forEach(card => {
            card.removeEventListener('mouseenter', hoverCard);
            card.removeEventListener('mouseleave', leaveCard);
        });
    };
  }, [filteredProjects]); 

  return (
    // Wrap in ReactLenis for the "No Gravity" scroll feel
    <ReactLenis root options={{ lerp: 0.08, duration: 1.5, smoothTouch: true }}>
      <section ref={containerRef} className="relative py-32 px-6 bg-slate-50 overflow-hidden cursor-none z-10 min-h-screen"> 
        
        {/* Background Subtle Gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500 via-white to-white pointer-events-none" />

        {/* Logo Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] opacity-[0.03] pointer-events-none mix-blend-multiply">
          <Image
            src="/logo.png"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        
        {/* Custom Cursor */}
        <div 
          ref={cursorRef} 
          className="fixed top-0 left-0 w-24 h-24 bg-blue-900/90 backdrop-blur-sm rounded-full pointer-events-none z-50 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 scale-0 opacity-0 shadow-2xl"
        >
            <span ref={cursorLabelRef} className="text-white text-xs font-bold uppercase tracking-widest opacity-0">View</span>
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 border-b border-blue-900/10 pb-8">
            <div>
               <h2 className="text-6xl md:text-8xl font-black text-blue-950 tracking-tighter mb-4">
                 SELECTED<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900 animate-gradient-x">WORK</span>
               </h2>
               <p className="text-blue-900/60 max-w-md text-lg font-light leading-relaxed">
                 Engineering excellence delivered across the Kingdom.
               </p>
            </div>
            <div className="flex gap-2 mt-8 md:mt-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`
                    relative px-6 py-3 rounded-full text-sm font-bold tracking-widest transition-all duration-500 border border-blue-900/10
                    ${activeCategory === cat ? 'bg-blue-900 text-white shadow-lg scale-105' : 'bg-white text-blue-900 hover:bg-blue-50 hover:scale-105'}
                  `}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-24">
            {filteredProjects.map((project, index) => (
              <div 
                  key={project.id} 
                  className={`project-card group relative flex flex-col gap-6 ${index % 2 === 1 ? 'md:translate-y-16' : ''}`} // Stagger grid layout for organic feel
              >
                {/* Image Container */}
                <div className="project-card-trigger relative w-full aspect-[3/4] overflow-hidden rounded-sm bg-stone-200 shadow-xl transition-shadow duration-500 group-hover:shadow-2xl">
                   {/* Parallax Image Wrapper */}
                   <div className="relative w-full h-[120%] -top-[10%]">
                      <Image 
                          src={project.image} 
                          fill 
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" // Subtle zoom on hover, parallax handles the Y movement
                          alt={project.title}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority={index < 3}
                      /> 
                   </div>
                   
                   {/* Overlay */}
                   <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/20 transition-colors duration-500" />
                </div>

                {/* Text Content */}
                <div className="flex justify-between items-end border-t border-blue-900/10 pt-4 group-hover:translate-x-2 transition-transform duration-500 ease-out">
                    <div>
                       <h3 className="text-3xl font-bold text-blue-950 leading-none mb-2">{project.title}</h3>
                       <span className="text-xs font-mono text-blue-600 uppercase tracking-widest">{project.category}</span>
                    </div>
                    <span className="text-4xl font-light text-blue-200 group-hover:text-blue-900 transition-colors duration-500">
                       {project.year}
                    </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-32 flex justify-center">
            <ViewAllProjectsButton />
          </div>
        </div>
      </section>
    </ReactLenis>
  );
}

// ... (Your ViewAllProjectsButton remains exactly the same) ...
function ViewAllProjectsButton() {
  const buttonRef = useRef(null);
  const textRef = useRef(null);
  const arrowRef = useRef(null);
  const rippleRef = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseEnter = () => {
      gsap.to(textRef.current, { x: -5, duration: 0.3, ease: 'power2.out' });
      gsap.fromTo(arrowRef.current, { x: -20, opacity: 0, scale: 0.8 }, { x: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)', delay: 0.1 });
      gsap.to(button, { scale: 1.02, duration: 0.3, ease: 'power2.out' });
    };

    const handleMouseLeave = () => {
      gsap.to(textRef.current, { x: 0, duration: 0.3, ease: 'power2.out' });
      gsap.to(arrowRef.current, { x: -20, opacity: 0, scale: 0.8, duration: 0.3, ease: 'power2.in' });
      gsap.to(button, { scale: 1, duration: 0.3, ease: 'power2.out' });
    };

    const handleClick = (e) => {
      // Create ripple element dynamically if you prefer, or reuse logic
    };

    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);
    button.addEventListener('click', handleClick);

    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
      button.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <Link href="/projects">
      <button ref={buttonRef} className="group/btn relative overflow-hidden bg-blue-900 text-white px-12 py-5 rounded-full font-bold text-lg tracking-wider uppercase transition-all duration-300 hover:bg-blue-800 hover:shadow-2xl hover:shadow-blue-900/50">
              <span className="relative flex items-center gap-4">
          <span ref={textRef} className="inline-block">View All Projects</span>
          <span ref={arrowRef} className="inline-block opacity-0 -translate-x-5 transition-transform duration-300 group-hover/btn:translate-x-0">→</span>
        </span>
        <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </button>
    </Link>
  );
}