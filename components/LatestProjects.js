'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { gsap } from '@/lib/gsap'; 
import Image from 'next/image';
import Link from 'next/link';

// ... (Keep your projects and categories arrays exactly as they were) ...
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
  
  const filteredProjects = useMemo(() => {
    return activeCategory === 'All' 
      ? projects 
      : projects.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.project-card', 
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6, 
          stagger: 0.1, 
          ease: 'power3.out',
          clearProps: 'all'
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [activeCategory]);

  // Custom Cursor Logic
  useEffect(() => {
    const cursor = cursorRef.current;
    const label = cursorLabelRef.current;

    const moveCursor = (e) => {
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.2, ease: 'power2.out' });
    };

    const hoverCard = () => {
      gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.3 });
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
    <section ref={containerRef} className="relative py-32 px-6 bg-stone-50 overflow-hidden cursor-none z-10"> 
      
      {/* Custom Cursor */}
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-24 h-24 bg-brand rounded-full pointer-events-none z-50 mix-blend-difference flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 scale-0 opacity-0"
      >
          <span ref={cursorLabelRef} className="text-white text-xs font-bold uppercase tracking-widest opacity-0">View</span>
      </div>

      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 border-b border-gray-200 pb-8">
          <div>
             <h2 className="text-6xl md:text-8xl font-black text-stone-900 tracking-tighter mb-4">
                SELECTED<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-dark">WORK</span>
             </h2>
             <p className="text-stone-500 max-w-md text-lg">
                Engineering excellence delivered across the Kingdom.
             </p>
          </div>
          <div className="flex gap-2 mt-8 md:mt-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`
                  relative px-6 py-3 rounded-full text-sm font-bold tracking-widest transition-all duration-300 border border-stone-200
                  ${activeCategory === cat ? 'bg-stone-900 text-white' : 'bg-white text-stone-500 hover:bg-stone-100'}
                `}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
          {filteredProjects.map((project) => (
            <div 
                key={project.id} 
                className="project-card group relative flex flex-col gap-4"
            >
              <div className="project-card-trigger relative w-full aspect-[4/5] overflow-hidden rounded-sm bg-stone-200">
                 <div className="relative w-full h-full transition-transform duration-700 ease-out group-hover:scale-110">
                    <Image 
                        src={project.image} 
                        fill 
                        className="object-cover"
                        alt={project.title}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    /> 
                 </div>
                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
              </div>

              <div className="flex justify-between items-start border-t border-stone-300 pt-4 transition-all duration-300 group-hover:border-stone-900">
                  <div>
                     <h3 className="text-2xl font-bold text-stone-900 leading-none mb-2">{project.title}</h3>
                     <span className="text-xs font-mono text-stone-500 uppercase tracking-widest">{project.category}</span>
                  </div>
                  <span className="text-sm font-bold text-stone-300 group-hover:text-stone-900 transition-colors">
                     {project.year}
                  </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 flex justify-center">
          <ViewAllProjectsButton />
        </div>
      </div>
    </section>
  );
}

// ... (Keep ViewAllProjectsButton and other helpers exactly as provided before) ...
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
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      gsap.fromTo(rippleRef.current, { x: x, y: y, scale: 0, opacity: 0.6 }, { scale: 4, opacity: 0, duration: 0.6, ease: 'power2.out' });
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
      <button ref={buttonRef} className="group/btn relative overflow-hidden bg-stone-900 text-white px-12 py-5 rounded-full font-bold text-lg tracking-wider uppercase transition-all duration-300 hover:bg-brand hover:shadow-2xl hover:shadow-brand/50">
        <span ref={rippleRef} className="absolute w-4 h-4 bg-white rounded-full pointer-events-none" style={{ transform: 'translate(-50%, -50%)' }} />
        <span className="relative flex items-center gap-4">
          <span ref={textRef} className="inline-block">View All Projects</span>
          <span ref={arrowRef} className="inline-block opacity-0 -translate-x-5 transition-transform duration-300 group-hover/btn:translate-x-0">→</span>
        </span>
        <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </button>
    </Link>
  );
}