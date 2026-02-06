'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import Link from 'next/link';
import { projectsData, categories } from '@/lib/projectsData';

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const cursorRef = useRef(null);
  const cursorLabelRef = useRef(null);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return selectedCategory === 'all'
      ? projectsData
      : projectsData.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  // Entrance animation
  useEffect(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline();

    // Animate header
    tl.fromTo('.page-header',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );

    // Animate cards with stagger
    tl.fromTo('.project-card',
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power3.out' },
      '-=0.4'
    );

    return () => tl.kill();
  }, []);

  // Filter change animation
  useEffect(() => {
    gsap.fromTo('.project-card',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.05, duration: 0.4, ease: 'power2.out' }
    );
  }, [selectedCategory]);

  // Custom Cursor Logic
  useEffect(() => {
    const cursor = cursorRef.current;
    const label = cursorLabelRef.current;
    if (!cursor || !label) return;

    const moveCursor = (e) => {
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.6, ease: 'power3.out' });
    };

    const hoverCard = () => {
      gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.2)' });
      gsap.to(label, { opacity: 1, duration: 0.3 });
    };

    const leaveCard = () => {
      gsap.to(cursor, { scale: 0, opacity: 0, duration: 0.3 });
      gsap.to(label, { opacity: 0, duration: 0.3 });
    };

    const cards = document.querySelectorAll('.project-card');
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
  }, [filteredProjects.length]);

  return (
    <div ref={containerRef} className="min-h-screen bg-stone-50 relative overflow-hidden cursor-none">
      
      {/* Custom Cursor — Circle + View */}
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-24 h-24 bg-blue-900/90 backdrop-blur-sm rounded-full pointer-events-none z-50 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 scale-0 opacity-0 shadow-2xl"
      >
        <span ref={cursorLabelRef} className="text-white text-xs font-bold uppercase tracking-widest opacity-0">View</span>
      </div>

      <div className="container mx-auto px-6 pt-32 pb-24">
        
        {/* Page Header */}
        <div className="page-header mb-16">
          <h1 className="text-6xl md:text-8xl font-black text-stone-900 tracking-tighter mb-4">
            OUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-dark">WORK</span>
          </h1>
          <p className="text-xl text-stone-500 max-w-2xl">
            Browse our portfolio of engineering excellence delivered across the Kingdom.
          </p>
        </div>

        {/* Glassy Filter Bar (Sticky) */}
        <div className="sticky top-24 z-30 mb-16 -mx-2">
          <div className="inline-flex flex-wrap gap-2 p-2 bg-white/30 backdrop-blur-md border border-white/40 rounded-full shadow-sm">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-stone-900 text-white shadow-md'
                    : 'text-stone-600 hover:bg-white/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Project Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {filteredProjects.map((project, index) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              ref={(el) => (cardsRef.current[index] = el)}
              className="project-card group cursor-none perspective-1000 block"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] mb-6 rounded-xl overflow-hidden bg-stone-200 shadow-md transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-2">
                <img
                  src={project.images[0]}
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                
                {/* Hover Overlay — Hammer + View */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 drop-shadow-lg">
                 
                  <span className="text-white text-xs font-bold uppercase tracking-widest">View</span>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider text-stone-700">
                  {project.categoryDisplay}
                </div>
              </div>

              {/* Text Content */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-stone-900 mb-1 leading-tight group-hover:text-brand transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-stone-500 text-sm">{project.location}</p>
                </div>
                <span className="text-stone-400 font-bold text-lg">{project.year}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-stone-500">No projects found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
