'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import Image from 'next/image';

export default function Footer() {
  const footerRef = useRef(null);
  const containerRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    // 1. FOOTER PARALLAX CONTENT
    // As we reveal the footer, the content inside moves slightly slower
    // creating a rich 3D depth effect.
    gsap.fromTo(containerRef.current, 
      { yPercent: -50 }, // Start slightly higher
      { 
        yPercent: 0, 
        ease: "none",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top bottom", // When top of footer hits bottom of viewport
          end: "bottom bottom",
          scrub: true
        } 
      }
    );

    // 2. GIANT TEXT ANIMATION
    // The letters space out slightly as they come into view
    gsap.fromTo(titleRef.current,
        { letterSpacing: "-0.1em", opacity: 0 },
        { 
            letterSpacing: "0em", 
            opacity: 0.1, 
            duration: 1,
            scrollTrigger: {
                trigger: footerRef.current,
                start: "top 80%",
                end: "bottom bottom",
                scrub: 1.5
            }
        }
    );

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <footer 
        ref={footerRef} 
        className="relative min-h-[80vh] bg-stone-950 text-white z-30 flex flex-col justify-between overflow-hidden"
    >
        
        {/* BACKGROUND GIANT LOGO */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <div 
                ref={titleRef} 
                className="relative w-[60vw] h-[60vw] opacity-5"
                style={{ position: 'relative' }}
            >
                <Image
                    src="/logo.png"
                    alt="PPC-United"
                    fill
                    className="object-contain"
                    style={{ filter: 'brightness(0) invert(1)' }}
                />
            </div>
        </div>

        {/* TOP BORDER SCANNER LINE */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-white/10">
            <div className="absolute top-0 left-0 h-full w-[20%] bg-gradient-to-r from-transparent via-brand to-transparent animate-scan" />
        </div>

        {/* --- MAIN CONTENT CONTAINER --- */}
        <div ref={containerRef} className="container mx-auto px-6 pt-20 pb-8 relative z-10 flex flex-col h-full justify-between">
            
            {/* Top Section: CTA */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-12">
                <div>
                    <span className="text-brand font-mono tracking-widest uppercase mb-4 block">Next Steps</span>
                    <h2 className="text-6xl md:text-8xl font-bold tracking-tighter max-w-3xl">
                        Ready to build <br/> the future?
                    </h2>
                </div>
                
                {/* GIANT CIRCULAR BUTTON */}
                <a 
                    href="mailto:info@ppc-united.com"
                    className="group relative w-48 h-48 rounded-full border border-white/20 flex items-center justify-center overflow-hidden hover:border-brand transition-colors duration-500 mt-8 md:mt-0"
                >
                    <div className="absolute inset-0 bg-brand scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full origin-center" />
                    <span className="relative z-10 text-xl font-bold group-hover:text-white transition-colors">
                        Email US
                    </span>
                </a>
            </div>

            {/* Bottom Section: Links & Info */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pt-12">
                {/* Column 1: Brand */}
                <div className="col-span-1 md:col-span-2">
                    <div className="mb-6">
                        <Image
                            src="/logo.png"
                            alt="PPC-United"
                            width={200}
                            height={48}
                            className="h-12 w-auto object-contain brightness-0 invert"
                        />
                    </div>
                    <p className="text-white/50 max-w-sm text-lg leading-relaxed">
                        Engineering Excellence in Saudi Arabia. delivering precision across MEP, Finishing, and Medical infrastructure since 2010.
                    </p>
                </div>

                {/* Column 2: Navigation */}
                <div>
                    <h4 className="text-sm font-mono text-white/40 uppercase tracking-widest mb-6">Sitemap</h4>
                    <ul className="space-y-4">
                        {['Projects', 'Services', 'News', 'About'].map(item => (
                            <li key={item}>
                                <a href="#" className="text-lg hover:text-brand transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-brand rounded-full scale-0 group-hover:scale-100 transition-transform" />
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Column 3: Socials */}
                <div>
                    <h4 className="text-sm font-mono text-white/40 uppercase tracking-widest mb-6">Socials</h4>
                    <ul className="space-y-4">
                        {['LinkedIn', 'Twitter', 'Instagram'].map(item => (
                            <li key={item}>
                                <a href="#" className="text-lg hover:text-brand transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-brand rounded-full scale-0 group-hover:scale-100 transition-transform" />
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Footer Note */}
            <div className="flex justify-between items-end border-t border-white/10 pt-8 text-white/30 text-sm font-mono uppercase">
                <span>&copy; {new Date().getFullYear()} PPC-United.</span>
                <span>Riyadh, KSA</span>
            </div>
        </div>
    </footer>
  );
}