'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

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

  useEffect(() => {
    const ctx = gsap.context(() => {
      const trigger = triggerRef.current;
      const slides = gsap.utils.toArray('.service-slide');

      // 1. HORIZONTAL SCROLL LOGIC
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
  }, []);

  return (
    <section ref={triggerRef} className="relative overflow-hidden z-20 bg-slate-900">
      {/* Progress Bar (Top) */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50 mix-blend-difference">
          <div ref={progressBarRef} className="h-full bg-red-600 origin-left scale-x-0" />
      </div>

      {/* Horizontal Container */}
      <div ref={sectionRef} className="flex h-screen w-[300%] overflow-hidden">
        
        {/* --- SERVICE 1: MEP --- */}
        <div id="mep" className="service-slide w-screen h-screen flex-shrink-0 relative flex items-center justify-center bg-slate-900 text-white overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path className="mep-line-path" d="M0,50 Q25,0 50,50 T100,50" fill="none" stroke="white" strokeWidth="0.5" />
                </svg>
            </div>
            
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 w-full max-w-7xl px-8 items-center gap-12">
                <div className="space-y-6">
                    <div className="text-blue-500 font-mono text-xl tracking-widest">01. SYSTEMS</div>
                    <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none">
                        M.E.P.<span className="text-blue-600">.</span>
                    </h2>
                    <p className="text-2xl text-slate-400 max-w-md">
                        {services[0].description}
                    </p>
                </div>
                <div className="h-[500px] w-full relative">
                    <img 
                        src={services[0].image} 
                        alt="MEP Engineering" 
                        className="w-full h-full object-cover rounded-2xl shadow-2xl border border-white/10"
                    />
                </div>
            </div>
        </div>

        {/* --- SERVICE 2: FINISHING --- */}
        <div id="finishing" className="service-slide w-screen h-screen flex-shrink-0 relative flex items-center justify-center bg-stone-100 text-stone-900 overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 w-full max-w-7xl px-8 items-center gap-12">
                <div className="order-2 md:order-1 h-[500px] w-full relative">
                    <img 
                        src={services[1].image} 
                        alt="Luxury Finishing" 
                        className="w-full h-full object-cover rounded-2xl shadow-2xl"
                    />
                </div>
                <div className="order-1 md:order-2 space-y-6 md:pl-20">
                    <div className="text-amber-600 font-mono text-xl tracking-widest">02. ESTHETICS</div>
                    <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none text-stone-900">
                        Finishing<span className="text-amber-600">.</span>
                    </h2>
                    <p className="text-2xl text-stone-600 max-w-md font-serif italic">
                        "{services[1].description}"
                    </p>
                </div>
            </div>
        </div>

        {/* --- SERVICE 3: MEDICAL --- */}
        <div id="medical" className="service-slide w-screen h-screen flex-shrink-0 relative flex items-center justify-center bg-teal-950 text-white overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/20 rounded-full blur-[100px] medical-pulse" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 w-full max-w-7xl px-8 items-center gap-12">
                <div className="space-y-6">
                    <div className="text-teal-400 font-mono text-xl tracking-widest">03. HEALTHCARE</div>
                    <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none">
                        Medi<span className="text-teal-400">cal</span>
                    </h2>
                    <p className="text-2xl text-teal-100/70 max-w-md">
                        {services[2].description}
                    </p>
                </div>
                <div className="h-[500px] w-full relative">
                     <img 
                        src={services[2].image} 
                        alt="Medical Construction" 
                        className="w-full h-full object-cover rounded-2xl shadow-2xl border border-white/10"
                    />
                </div>
            </div>
        </div>

      </div>
    </section>
  );
}
