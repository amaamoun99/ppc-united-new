'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import Link from 'next/link';
import { displayCategories } from '@/lib/projectsData';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const categories = displayCategories;

export default function LatestProjects({ onContentReady }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [projects, setProjects] = useState([]);
  const containerRef = useRef(null);
  const cursorRef = useRef(null);
  const cursorLabelRef = useRef(null);
  const projectRefs = useRef([]);
  const { isMobile, isTablet } = useMediaQuery();
  const showCarousel = isTablet; // Carousel on tablets/phones (<1024px), grid on desktop

  // Helper function to map display category to project categoryDisplay
  const mapDisplayCategoryToProjectCategory = (displayCategory) => {
    const categoryMap = {
      'All': 'All',
      'MEP Works': 'MEP',
      'Medical Finishing': 'Medical Finishing'
    };
    return categoryMap[displayCategory] || displayCategory;
  };

  // Get featured, active projects; API returns priority DESC, preserve order
  const featuredProjects = useMemo(() => {
    return projects
      .filter((project) => project.isFeatured && project.isActive !== false)
      .map((project) => ({
        id: project.id,
        detailSlug: project.slug ,
        title: project.title,
        category: project.categoryDisplay || project.category,
        image: project.images?.[0],
        year: project.year ? String(project.year) : new Date(project.createdAt).getFullYear().toString(),
      }));
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') {
      return featuredProjects;
    }
    // Map display category to project categoryDisplay for comparison
    const targetCategory = mapDisplayCategoryToProjectCategory(activeCategory);
    return featuredProjects.filter(p => p.category === targetCategory);
  }, [activeCategory, featuredProjects]);

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        if (!res.ok) return;
        const data = await res.json();
        setProjects(data || []);
      } catch (err) {
        console.error('Failed to load projects', err);
      }
    };

    fetchProjects();
  }, []);

  // Notify parent when dynamic content has loaded
  useEffect(() => {
    if (typeof onContentReady !== 'function') return;
    const t1 = setTimeout(() => onContentReady(), 0);
    const t2 = setTimeout(() => onContentReady(), 450);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [projects.length, onContentReady]);

  // Carousel state (only used on tablets/phones)
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const autoRotateRef = useRef(null);

  const cardsPerView = isMobile ? 1 : 2;

  // Auto-rotate carousel (tablets/phones only)
  useEffect(() => {
    if (!showCarousel || filteredProjects.length <= cardsPerView) return;
    autoRotateRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + cardsPerView) % filteredProjects.length);
    }, 5000);
    return () => {
      if (autoRotateRef.current) clearInterval(autoRotateRef.current);
    };
  }, [filteredProjects.length, cardsPerView, showCarousel]);

  // Animate carousel transition (tablets/phones only)
  useEffect(() => {
    if (!showCarousel || !carouselRef.current || filteredProjects.length === 0) return;
    const percentPerSlide = 100 / filteredProjects.length;
    const translatePercent = currentIndex * percentPerSlide;
    gsap.to(carouselRef.current, {
      x: `-${translatePercent}%`,
      duration: isMobile ? 0.4 : 0.6,
      ease: isMobile ? 'power2.out' : 'power2.inOut'
    });
  }, [currentIndex, filteredProjects.length, isMobile, showCarousel]);

  const goToNext = () => {
    if (autoRotateRef.current) clearInterval(autoRotateRef.current);
    setCurrentIndex((prev) => (prev + cardsPerView) % filteredProjects.length);
  };

  const goToPrev = () => {
    if (autoRotateRef.current) clearInterval(autoRotateRef.current);
    setCurrentIndex((prev) => (prev - cardsPerView + filteredProjects.length) % filteredProjects.length);
  };

  // Desktop: entrance animation & parallax (original behavior)
  useEffect(() => {
    if (showCarousel) return; // Skip on tablets/phones (carousel handles its own display)
    
    const ctx = gsap.context(() => {
      gsap.fromTo('.desktop-project-card',
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.1,
          ease: 'power4.out',
          clearProps: 'opacity, transform'
        }
      );

      // Parallax effect on desktop
      setTimeout(() => {
        const cards = document.querySelectorAll('.desktop-project-card');
        cards.forEach((card) => {
          const image = card.querySelector('img');
          if (!image) return;
          gsap.set(image, { scale: 1.2, y: '-15%' });
          gsap.to(image, {
            y: '15%',
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            }
          });
        });
      }, 100);
    }, containerRef);

    return () => ctx.revert();
  }, [activeCategory, filteredProjects, showCarousel]);

  // Desktop: custom cursor
  useEffect(() => {
    if (showCarousel) return; // No cursor on tablets/phones
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

    const cards = document.querySelectorAll('.desktop-project-card');
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
  }, [filteredProjects, showCarousel]); 

  return (
    <section ref={containerRef} className={`relative pt-24 md:pt-32 pb-24 md:pb-32 px-4 md:px-6 bg-white overflow-hidden z-10 ${showCarousel ? '' : 'cursor-none'}`}>
      {/* Logo Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] opacity-[0.03] pointer-events-none mix-blend-multiply">
        <Image src="/logo.png" alt="" fill className="object-contain" />
      </div>

      {/* Custom Cursor — desktop only */}
      {!showCarousel && (
        <div
          ref={cursorRef}
          className="fixed top-0 left-0 w-24 h-24 bg-blue-900/90 backdrop-blur-sm rounded-full pointer-events-none z-50 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 scale-0 opacity-0 shadow-2xl"
        >
          <span ref={cursorLabelRef} className="text-white text-xs font-bold uppercase tracking-widest opacity-0">View</span>
        </div>
      )}

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-blue-900/10 pb-8">
          <div>
            <h2 className="text-4xl sm:text-6xl md:text-8xl font-black text-blue-950 tracking-tighter mb-4">
              SELECTED<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900">WORK</span>
            </h2>
            <p className="text-blue-900/60 max-w-md text-lg font-light leading-relaxed">
              Engineering excellence delivered across the Kingdom.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mt-8 md:mt-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setCurrentIndex(0); }}
                className={`relative px-4 py-2.5 md:px-6 md:py-3 rounded-full text-xs md:text-sm font-bold tracking-widest transition-all duration-500 border border-blue-900/10 min-h-[44px] md:min-h-0 ${
                  activeCategory === cat ? 'bg-blue-900 text-white shadow-lg scale-105' : 'bg-white text-blue-900 hover:bg-blue-50 hover:scale-105'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tablets/Phones: Carousel */}
        {showCarousel && filteredProjects.length > 0 && (
          <div className="relative">
            <div className="overflow-hidden">
              <div
                ref={carouselRef}
                className="flex"
                style={{ width: `${filteredProjects.length * (100 / cardsPerView)}%` }}
              >
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex-shrink-0 px-2 md:px-4"
                    style={{ width: `${100 / filteredProjects.length}%` }}
                  >
                    <Link href={`/projects/${project.detailSlug}`} className="group block">
                      <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg bg-stone-200 shadow-xl transition-all duration-500 group-hover:shadow-2xl mb-6">
                        {project.image ? (
                          <Image
                            src={project.image}
                            fill
                            className="object-cover"
                            alt={project.title}
                            sizes={isMobile ? '100vw' : '50vw'}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-blue-900/30 text-sm font-medium">No image</div>
                        )}
                      </div>
                      <div className="flex justify-between items-end border-t border-blue-900/10 pt-4">
                        <div>
                          <h3 className="text-2xl md:text-3xl font-bold text-blue-950 leading-none mb-2">{project.title}</h3>
                          <span className="text-xs font-mono text-blue-600 uppercase tracking-widest">{project.category}</span>
                        </div>
                        <span className="text-3xl font-light text-blue-200">{project.year}</span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            {filteredProjects.length > cardsPerView && (
              <>
                <button
                  onClick={goToPrev}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border border-blue-900/20 flex items-center justify-center hover:bg-blue-900 hover:text-white transition-all shadow-lg z-10"
                  aria-label="Previous"
                >
                  ←
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border border-blue-900/20 flex items-center justify-center hover:bg-blue-900 hover:text-white transition-all shadow-lg z-10"
                  aria-label="Next"
                >
                  →
                </button>
              </>
            )}

            {/* Dots */}
            {filteredProjects.length > cardsPerView && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: Math.ceil(filteredProjects.length / cardsPerView) }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx * cardsPerView)}
                    className={`w-2 h-2 rounded-full transition-all ${currentIndex === idx * cardsPerView ? 'bg-blue-900 w-8' : 'bg-blue-900/30'}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Desktop: Grid (original layout with parallax and custom cursor) */}
        {!showCarousel && filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-24">
            {filteredProjects.map((project, index) => (
              <Link
                key={project.id}
                href={`/projects/${project.detailSlug}`}
                className={`desktop-project-card group relative flex flex-col gap-6 cursor-none ${index % 2 === 1 ? 'md:translate-y-16' : ''}`}
              >
                <div className="relative w-full aspect-[3/4] overflow-hidden rounded-sm bg-stone-200 shadow-xl transition-shadow duration-500 group-hover:shadow-2xl">
                  <div className="relative w-full h-[120%] -top-[10%]">
                    {project.image ? (
                      <Image
                        src={project.image}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        alt={project.title}
                        sizes="(max-width: 1200px) 50vw, 33vw"
                        priority={index < 3}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-blue-900/30 text-sm font-medium">No image</div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/20 transition-colors duration-500" />
                </div>

                <div className="flex justify-between items-end border-t border-blue-900/10 pt-4 group-hover:translate-x-2 transition-transform duration-500 ease-out">
                  <div>
                    <h3 className="text-3xl font-bold text-blue-950 leading-none mb-2">{project.title}</h3>
                    <span className="text-xs font-mono text-blue-600 uppercase tracking-widest">{project.category}</span>
                  </div>
                  <span className="text-4xl font-light text-blue-200 group-hover:text-blue-900 transition-colors duration-500">{project.year}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-16 flex justify-center">
          <ViewAllProjectsButton />
        </div>
      </div>
    </section>
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
    <a href="/projects">
      <button ref={buttonRef} className="group/btn relative overflow-hidden bg-blue-900 text-white px-12 py-5 rounded-full font-bold text-lg tracking-wider uppercase transition-all duration-300 hover:bg-blue-800 hover:shadow-2xl hover:shadow-blue-900/50">
              <span className="relative flex items-center gap-4">
          <span ref={textRef} className="inline-block">View All Projects</span>
          <span ref={arrowRef} className="inline-block opacity-0 -translate-x-5 transition-transform duration-300 group-hover/btn:translate-x-0">→</span>
        </span>
        <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </button>
    </a>
  );
}