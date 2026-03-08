'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import Image from 'next/image';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const services = [
  {
    id: 'mep',
    title: 'M.E.P',
    subtitle: 'Mechanical • Electrical • Plumbing',
    description: 'The nervous system of your building. We engineer invisible precision.',
    bg: 'bg-slate-900',
    accent: 'text-blue-500',
    image: 'https://t4.ftcdn.net/jpg/03/37/92/85/360_F_337928582_8lL90UXA8YelqvRsEuuUcsa35wZAQiyP.jpg'
  },
  {
    id: 'finishing',
    title: 'Finishing',
    subtitle: 'Aesthetic • Perfection • Luxury',
    description: 'Where engineering meets art. We craft textures you can feel.',
    bg: 'bg-stone-100',
    accent: 'text-amber-600',
    image: 'https://images.pexels.com/photos/3797991/pexels-photo-3797991.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 'medical',
    title: 'Medical',
    subtitle: 'Sterile • Advanced • Compliant',
    description: 'Building the future of healthcare with zero-tolerance precision.',
    bg: 'bg-teal-950',
    accent: 'text-teal-400',
    image: 'https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
];

export default function Services() {
  const sectionRef = useRef(null);
  const triggerRef = useRef(null);
  const progressBarRef = useRef(null);
  const { isMobile } = useMediaQuery();

  useEffect(() => {
    if (isMobile) return; // No horizontal scroll on mobile; vertical layout is static

    const ctx = gsap.context(() => {
      const trigger = triggerRef.current;
      const slides = gsap.utils.toArray('.service-slide');
      if (!trigger || !slides.length) return;

      // 1. HORIZONTAL SCROLL LOGIC — desktop only
      const scrollTween = gsap.to(slides, {
        xPercent: -100 * (slides.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: trigger,
          pin: true,
          pinSpacing: true,
          scrub: 1,
          end: '+=3000',
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (progressBarRef.current) {
              gsap.to(progressBarRef.current, { scaleX: self.progress, duration: 0.1 });
            }
          }
        },
      });

      // 2. PARALLAX TEXT ANIMATIONS
      slides.forEach((slide) => {
        const title = slide.querySelector('h2');
        if (!title) return;
        gsap.fromTo(title,
          { x: 100, opacity: 0 },
          {
            x: -100,
            opacity: 1,
            scrollTrigger: {
              trigger: slide,
              containerAnimation: scrollTween,
              start: "left center",
              end: "right center",
              scrub: true
            }
          }
        );
      });

      // 3. BACKGROUND ANIMATIONS
      const path = document.querySelector('.mep-line-path');
      if (path) {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(path, {
          strokeDashoffset: 0,
          scrollTrigger: {
            trigger: '#mep',
            containerAnimation: scrollTween,
            start: 'left center',
            end: 'right center',
            scrub: 1
          }
        });
      }

      // Medical: Heartbeat
      gsap.to('.medical-pulse', {
        scale: 1.1,
        opacity: 0.5,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
    }, triggerRef);

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <section ref={triggerRef} className="relative overflow-hidden z-20 bg-gradient-to-b from-blue-800 via-blue-700 to-blue-600">
      {/* Progress Bar (Top) — desktop only */}
      <div className="hidden md:block fixed top-0 left-0 w-full h-1 bg-blue-900/30 z-50 mix-blend-difference">
        <div ref={progressBarRef} className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 origin-left scale-x-0" />
      </div>

      {/* Mobile: Vertical stack — same per-service colors as desktop (MEP blue-900, Finishing blue-600, Medical blue-500) */}
      <div className="md:hidden flex flex-col">
        {services.map((service, index) => {
          const bgClass = index === 0 ? 'bg-blue-900' : index === 1 ? 'bg-blue-600' : 'bg-blue-500';
          return (
          <div
            key={service.id}
            className={`min-h-screen flex items-center justify-center px-6 py-16 text-white ${bgClass}`}
          >
            <div className="grid grid-cols-1 w-full max-w-lg gap-8">
              <div className="space-y-4">
                <div className="[color:var(--tw-ring-offset-color)] font-mono text-lg tracking-widest">{String(index + 1).padStart(2, '0')}. {service.id === 'mep' ? 'SYSTEMS' : service.id === 'finishing' ? 'ESTHETICS' : 'HEALTHCARE'}</div>
                <h2 className="text-5xl sm:text-6xl font-black uppercase tracking-tighter leading-none">
                  {service.title}<span className="text-blue-400">.</span>
                </h2>
                <p className="text-lg text-white/90 max-w-md">
                  {service.description}
                </p>
              </div>
              <div className="h-[280px] w-full relative rounded-2xl overflow-hidden border border-blue-500/20">
                <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
          );
        })}
      </div>

      {/* Desktop: Horizontal Container */}
      <div ref={sectionRef} className="hidden md:flex h-screen w-[300%] overflow-hidden">
        
        {/* --- SERVICE 1: MEP --- */}
        <div id="mep" className="service-slide w-screen h-screen flex-shrink-0 relative flex items-center justify-center bg-blue-900 text-white overflow-hidden">
            {/* Logo Watermark */}
            {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] opacity-5 pointer-events-none">
                <Image
                    src="/logo.png"
                    alt=""
                    fill
                    className="object-contain"
                    style={{ filter: 'brightness(0) invert(1)' }}
                />
            </div> */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path className="mep-line-path" d="M0,50 Q25,0 50,50 T100,50" fill="none" stroke="rgb(0,168,255)" strokeWidth="0.5" />
                </svg>
            </div>
            
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 w-full max-w-7xl px-8 items-center gap-12">
                <div className="space-y-6">
                    <div className="text-blue-400 font-mono text-xl tracking-widest">01. SYSTEMS</div>
                    <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none">
                        M.E.P.<span className="text-blue-500">.</span>
                    </h2>
                    <p className="text-2xl text-blue-200/80 max-w-md">
                        {services[0].description}
                    </p>
                </div>
                <div className="h-[500px] w-full relative">
                    <img 
                        src={services[0].image} 
                        alt="MEP Engineering" 
                        className="w-full h-full object-cover rounded-2xl shadow-2xl border border-blue-500/20"
                    />
                </div>
            </div>
        </div>

{/* --- SERVICE 2: FINISHING --- */}
<div id="finishing" className="service-slide w-screen h-screen flex-shrink-0 relative flex items-center justify-center bg-blue-600  text-white overflow-hidden">
            {/* Logo Watermark */}
            {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] opacity-5 pointer-events-none">
                <Image
                    src="/logo.png"
                    alt=""
                    fill
                    className="object-contain"
                    style={{ filter: 'brightness(0) invert(1)' }}
                />
            </div> */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 w-full max-w-7xl px-8 items-center gap-12">
                <div className="order-2 md:order-1 h-[500px] w-full relative">
                    <img 
                        src={services[1].image} 
                        alt="Luxury Finishing" 
                        className="w-full h-full object-cover rounded-2xl shadow-2xl border border-blue-400/20"
                    />
                </div>
                <div className="order-1 md:order-2 space-y-6 md:pl-20">
                    <div className="text-blue-300 font-mono text-xl tracking-widest">02. ESTHETICS</div>
                    <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none text-white">
                        Finishing<span className="text-blue-400">.</span>
                    </h2>
                    <p className="text-2xl text-blue-100/90 max-w-md font-serif italic">
                        &ldquo;{services[1].description}&rdquo;
                    </p>
                </div>
            </div>
        </div>

        {/* --- SERVICE 3: MEDICAL --- */}
        <div id="medical" className="service-slide w-screen h-screen flex-shrink-0 relative flex items-center justify-center bg-blue-500 text-white overflow-hidden">
            {/* Logo Watermark */}
            {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] opacity-5 pointer-events-none z-0">
                <Image
                    src="/logo.png"
                    alt=""
                    fill
                    className="object-contain"
                    style={{ filter: 'brightness(0) invert(1)' }}
                />
            </div> */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-400/30 rounded-full blur-[100px] medical-pulse z-0" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 w-full max-w-7xl px-8 items-center gap-12">
                <div className="space-y-6">
                    <div className="text-white font-mono text-xl tracking-widest font-bold">03. HEALTHCARE</div>
                    <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none text-white drop-shadow-2xl">
                        Medi<span className="text-white">cal</span>
                    </h2>
                    <p className="text-2xl text-white font-medium max-w-md leading-relaxed">
                        {services[2].description}
                    </p>
                </div>
                <div className="h-[500px] w-full relative">
                     <img 
                        src={services[2].image} 
                        alt="Medical Construction" 
                        className="w-full h-full object-cover rounded-2xl shadow-2xl border border-blue-400/20"
                    />
                </div>
            </div>
        </div>
        
      </div>
    </section>
  );
}
