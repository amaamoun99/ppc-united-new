'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import Link from 'next/link';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export default function MediaNews({ onContentReady }) {
  const sectionRef = useRef(null);
  const marqueeInnerRef = useRef(null);
  const rafIdRef = useRef(null);
  const [newsItems, setNewsItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const autoRotateRef = useRef(null);
  const { isMobile, isTablet } = useMediaQuery();

  // Cards per view: mobile 1, tablet 2, desktop 3
  const cardsPerView = isMobile ? 1 : (isTablet ? 2 : 3);
  const totalSlides = Math.max(1, newsItems.length - cardsPerView + 1);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      if (!section) return;
      
      let xPercent = 0;
      let direction = -1;
      
      const animateMarquee = () => {
        if (!marqueeInnerRef.current) return;
        if (xPercent <= -100) xPercent = 0;
        if (xPercent > 0) xPercent = -100;
        gsap.set(marqueeInnerRef.current, { xPercent: xPercent });
        xPercent += 0.05 * direction; 
        rafIdRef.current = requestAnimationFrame(animateMarquee);
      };
      
      rafIdRef.current = requestAnimationFrame(animateMarquee);
    }, sectionRef);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      ctx.revert();
    };
  }, []);

  // Load featured, published news from API; sort by priority DESC
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/news');
        if (!res.ok) return;
        const data = await res.json();
        const featured = (data || [])
          .filter((item) => item.isFeatured && item.published)
          .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
          .map((item) => ({
            ...item,
            date: item.publishedAt
              ? new Date(item.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
              : '—',
            category: item.category || 'News',
            coverImage: (item.images && item.images[0]) || null,
          }));
        setNewsItems(featured);
      } catch (err) {
        console.error('Failed to load news', err);
      }
    };

    fetchNews();
  }, []);

  // Notify parent when dynamic content has loaded
  useEffect(() => {
    if (typeof onContentReady !== 'function') return;
    const t1 = setTimeout(() => onContentReady(), 0);
    const t2 = setTimeout(() => onContentReady(), 450);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [newsItems.length, onContentReady]);

  // Clamp currentIndex when screen size or data changes
  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, totalSlides - 1));
  }, [totalSlides, cardsPerView]);

  // Auto-rotate carousel (advance by 1 card)
  useEffect(() => {
    if (newsItems.length <= 1 || totalSlides <= 1) return;

    autoRotateRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => {
      if (autoRotateRef.current) clearInterval(autoRotateRef.current);
    };
  }, [newsItems.length, totalSlides]);

  // Animate carousel transition
  useEffect(() => {
    if (!carouselRef.current || newsItems.length === 0) return;
    const percentPerCard = 100 / newsItems.length;
    gsap.to(carouselRef.current, {
      x: `-${currentIndex * percentPerCard}%`,
      duration: 0.8,
      ease: 'power3.inOut'
    });
  }, [currentIndex, newsItems.length]);

  const goToNext = () => {
    if (autoRotateRef.current) clearInterval(autoRotateRef.current);
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const goToPrev = () => {
    if (autoRotateRef.current) clearInterval(autoRotateRef.current);
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <section 
        ref={sectionRef} 
        className="py-32 pb-0 relative z-10 overflow-hidden border-t border-blue-500/20 bg-gradient-to-b from-blue-800 via-blue-900 to-blue-950"
        style={{ isolation: 'isolate' }}
    >
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header Layout */}
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-20 border-b border-blue-500/20 pb-8">
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-white">
                NEWS<span className="text-blue-400">.</span>
            </h2>
            <div className="flex items-center gap-4 text-blue-300/70 text-sm font-mono uppercase tracking-widest mt-6 md:mt-0">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                Company Updates
            </div>
        </div>

        {/* --- CAROUSEL (responsive: 1 / 2 / 3 cards per view) --- */}
        {newsItems.length > 0 ? (
          <div className="relative">
            <div className="overflow-hidden">
              <div
                ref={carouselRef}
                className="flex"
                style={{ width: `${(newsItems.length * 100) / cardsPerView}%` }}
              >
                {newsItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex-shrink-0 px-4 md:px-6 lg:px-4"
                    style={{ width: `${100 / newsItems.length}%` }}
                  >
                    <SpotlightCard item={item} />
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            {totalSlides > 1 && (
              <>
                <button
                  onClick={goToPrev}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-12 h-12 rounded-full bg-blue-900/80 backdrop-blur-sm border border-blue-500/30 flex items-center justify-center hover:bg-blue-500/20 hover:border-blue-400/50 transition-all shadow-lg z-10 text-white"
                  aria-label="Previous"
                >
                  ←
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-12 h-12 rounded-full bg-blue-900/80 backdrop-blur-sm border border-blue-500/30 flex items-center justify-center hover:bg-blue-500/20 hover:border-blue-400/50 transition-all shadow-lg z-10 text-white"
                  aria-label="Next"
                >
                  →
                </button>
              </>
            )}

            {/* Dots Indicator (one per slide) */}
            {totalSlides > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: totalSlides }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${currentIndex === idx ? 'bg-blue-400 w-8' : 'bg-blue-400/30'}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-blue-200/70 text-sm text-center">
            No featured news yet. Check back soon.
          </p>
        )}

      </div>

      {/* --- BACKGROUND DECORATION --- */}
      {/* Giant Marquee Text running behind content with logo pattern */}
      <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 opacity-[0.03] pointer-events-none select-none">
          <div ref={marqueeInnerRef} className="whitespace-nowrap flex gap-10">
              {[...Array(4)].map((_, i) => (
                 <span key={i} className="text-[20vw] font-black leading-none text-blue-400">
                     PRESS • RELEASES • MEDIA • PPC-UNITED • 
                 </span>
              ))}
          </div>
      </div>

    </section>
  );
}

// --- SUB-COMPONENT: SPOTLIGHT CARD ---
function SpotlightCard({ item }) {
    const cardRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const { left, top } = cardRef.current.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        cardRef.current.style.setProperty("--mouse-x", `${x}px`);
        cardRef.current.style.setProperty("--mouse-y", `${y}px`);
    };

    return (
        <Link href={`/news/${item.slug || item.id}`}>
        <article 
            ref={cardRef}
            onMouseMove={handleMouseMove}
            className="group relative bg-blue-900/30 rounded-lg border border-blue-500/20 overflow-hidden transition-all hover:bg-blue-900/50 hover:-translate-y-2 duration-500 h-full"
        >
            {/* The Spotlight Gradient Overlay with Blue */}
            <div 
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-10"
                style={{
                    background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(0,168,255,0.15), transparent 40%)`
                }}
            />
            {item.coverImage && (
                <div className="relative w-full aspect-[16/10] overflow-hidden">
                    <img src={item.coverImage} alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
            )}
            <div className="p-8 relative z-10">
            {/* Date Badge */}
            <div className="flex justify-between items-start mb-8 opacity-70">
                <span className="font-mono text-xs border border-blue-400/30 px-2 py-1 rounded text-blue-300">
                    {item.category}
                </span>
                <span className="font-mono text-xs text-blue-200">
                    {item.date}
                </span>
            </div>

            {/* Content */}
            <div className="relative z-10 space-y-4">
                <h3 className="text-3xl font-bold text-white leading-tight group-hover:text-blue-400 transition-colors duration-300">
                    {item.title}
                </h3>
                <p className="text-lg text-blue-200/80 leading-relaxed border-l-2 border-blue-500/30 pl-4 group-hover:border-blue-400 transition-colors">
                    {item.excerpt}
                </p>
            </div>

            {/* Bottom Interaction */}
            <div className="mt-12 flex items-center gap-4 text-white font-bold tracking-widest text-sm group/btn cursor-pointer">
                <span className="relative overflow-hidden">
                   READ ARTICLE
                   <span className="absolute bottom-0 left-0 w-full h-[1px] bg-blue-400 transform -translate-x-100 group-hover/btn:translate-x-0 transition-transform duration-300"></span>
                </span>
                <span className="transform group-hover/btn:translate-x-2 transition-transform duration-300">→</span>
            </div>
            </div>
        </article>
        </Link>
    );
}

// --- CTA BUTTON COMPONENT ---
function ViewAllNewsButton() {
  const buttonRef = useRef(null);
  const textRef = useRef(null);
  const arrowRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseEnter = () => {
      gsap.to(textRef.current, { 
        x: -10, 
        duration: 0.3, 
        ease: 'power2.out' 
      });
      gsap.fromTo(arrowRef.current, 
        { x: -30, opacity: 0, rotation: -45 },
        { x: 0, opacity: 1, rotation: 0, duration: 0.4, ease: 'back.out(1.7)', delay: 0.1 }
      );
      gsap.to(glowRef.current, { 
        opacity: 1, 
        scale: 1.2, 
        duration: 0.4, 
        ease: 'power2.out' 
      });
    };

    const handleMouseLeave = () => {
      gsap.to(textRef.current, { 
        x: 0, 
        duration: 0.3, 
        ease: 'power2.out' 
      });
      gsap.to(arrowRef.current, { 
        x: -30, 
        opacity: 0, 
        rotation: -45, 
        duration: 0.3, 
        ease: 'power2.in' 
      });
      gsap.to(glowRef.current, { 
        opacity: 0, 
        scale: 1, 
        duration: 0.3, 
        ease: 'power2.out' 
      });
    };

    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <Link href="/contact">
      <button
        ref={buttonRef}
        className="group/btn relative overflow-hidden bg-blue-900/40 backdrop-blur-md border border-blue-500/30 text-white px-10 py-4 rounded-full font-bold text-base tracking-widest uppercase transition-all duration-300 hover:bg-blue-800/50 hover:border-blue-400/50"
      >
        {/* Glow Effect */}
        <span
          ref={glowRef}
          className="absolute inset-0 bg-blue-400/30 blur-xl opacity-0 transition-opacity duration-300"
        />
        
        {/* Button Content */}
        <span className="relative flex items-center gap-4 z-10">
          <span ref={textRef} className="inline-block">View All News</span>
          <span 
            ref={arrowRef}
            className="inline-block opacity-0 -translate-x-8 transition-transform duration-300"
          >
            →
          </span>
        </span>
        
        {/* Animated Border */}
        <span className="absolute inset-0 rounded-full border-2 border-blue-400/0 group-hover/btn:border-blue-400/50 transition-colors duration-300" />
      </button>
    </Link>
  );
}