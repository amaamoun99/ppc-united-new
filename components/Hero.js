'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import Image from 'next/image';

export default function Hero() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const textRef = useRef(null);
  const cursorRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // 1. INTRO ANIMATION
    tl.fromTo(containerRef.current, 
      { clipPath: "circle(0% at 50% 50%)" },
      { 
        clipPath: "circle(150% at 50% 50%)", 
        duration: 2.5, 
        ease: "power4.inOut",
        delay: 0.2
      }
    );

    // 2. TEXT REVEAL
    const textLines = textRef.current.querySelectorAll('.hero-text-line');
    tl.fromTo(textLines, 
      { y: 150, skewY: 10 },
      { y: 0, skewY: 0, duration: 1.2, stagger: 0.1, ease: "power3.out" },
      "-=1.5"
    );

    // 3. X-RAY CURSOR LOGIC
    const handleMouseMove = (e) => {
      if (!cursorRef.current) return;
      
      const { clientX, clientY } = e;
      
      gsap.to(cursorRef.current, {
        css: { 
            WebkitMaskPosition: `${clientX - 150}px ${clientY - 150}px`,
            maskPosition: `${clientX - 150}px ${clientY - 150}px`
        },
        duration: 0.2,
        ease: "power1.out"
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 4. PARALLAX SCROLL
    gsap.to(videoRef.current, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      {/* --- LAYER 1: BLACK & WHITE VIDEO (Background) --- */}
      <div className="absolute inset-0 z-0">
        <video 
            ref={videoRef}
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover filter grayscale brightness-50 contrast-125"
        >
            <source src="https://media.istockphoto.com/id/2188908764/video/t-l-drone-point-view-of-workers-working-on-construction-site-hangzhou-china.mp4?s=mp4-640x640-is&k=20&c=ypeL9nCFAwyjYx-8ofMfbe1TkQyRTqsCZz16k9I6MqM=" type="video/mp4" />
        </video>
      </div>

      {/* --- LAYER 2: COLOR VIDEO (Revealed by Mouse) --- */}
      <div 
        ref={cursorRef}
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
            WebkitMaskImage: "radial-gradient(circle 150px at center, black 40%, transparent 100%)",
            maskImage: "radial-gradient(circle 150px at center, black 40%, transparent 100%)",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "50% 50%", 
            maskPosition: "50% 50%"
        }}
      >
         <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover"
         >
             {/* Note: Ideally, this source should match Layer 1 for the X-Ray effect to line up perfectly */}
            <source src="https://videos.pexels.com/video-files/3205626/3205626-uhd_2560_1440_25fps.mp4" type="video/mp4" />
         </video>
      </div>

      {/* --- LAYER 3: CONTENT & OVERLAYS --- */}
      {/* 1. Global Overlay */}
      <div className="absolute inset-0 z-20 bg-black/30" />

      {/* 2. Text Container */}
      <div 
        ref={textRef}
        className="relative z-30 h-full flex flex-col items-center justify-center text-center px-4 pointer-events-none"
      >
        {/* --- GLASSY GLOW CARD WRAPPER --- */}
        <div className="relative bg-black/40 backdrop-blur-md border border-white/10 p-10 md:p-16 rounded-3xl shadow-2xl shadow-black/50 overflow-hidden">
            
            {/* Optional: Inner Ambient Glow behind the logo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-brand/20 blur-[80px] rounded-full -z-10" />

            <div className="overflow-hidden flex justify-center">
                <div className="hero-text-line relative w-[300px] md:w-[500px] h-[120px] md:h-[200px]">
                    <Image
                        src="/logo.png"
                        alt="PPC-United"
                        fill
                        className="object-contain drop-shadow-xl"
                        priority
                    />
                </div>
            </div>
            
            <div className="overflow-hidden mt-6">
                <p className="hero-text-line text-xl md:text-3xl text-white font-light tracking-[0.2em] uppercase drop-shadow-lg">
                    Inteligent <span className="text-brand font-bold">Solutions</span>
                </p>
            </div>
            
            {/* Decorative Lines */}
            <div className="overflow-hidden flex justify-center mt-8">
                 <div className="hero-text-line w-24 h-1 bg-brand shadow-[0_0_15px_rgba(var(--brand-rgb),0.8)]" />
            </div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center gap-2">
         <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest animate-pulse">Scroll</span>
         <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent opacity-50" />
      </div>

    </section>
  );
}