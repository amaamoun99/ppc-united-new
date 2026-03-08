'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const menuItems = [
  { label: 'Home', href: '/', image: '/images/menu-home.jpg' },
  { label: 'Projects', href: '/projects', image: '/images/menu-projects.jpg' },
  { label: 'About', href: '/about', image: '/images/menu-about.jpg' },
  { label: 'Contact', href: '/contact', image: '/images/menu-contact.jpg' },
];

export default function Header() {
  const headerRef = useRef(null);
  const menuOverlayRef = useRef(null);
  const menuContentRef = useRef(null);
  const previewImageRef = useRef(null);
  
  // Store the timeline in a ref so it persists across re-renders
  const tlRef = useRef(null);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const pathname = usePathname();
  const { isMobile } = useMediaQuery();

  const lastScrollRef = useRef(0);
  const menuOpenRef = useRef(isMenuOpen);
  menuOpenRef.current = isMenuOpen;

  // Hide header on scroll down, show on scroll up. Use RAF + Lenis/window scroll so it works with smooth scroll.
  useEffect(() => {
    const SCROLL_THRESHOLD = 100;
    const TOP_ZONE = 60;
    const DIRECTION_THRESHOLD = 8;

    const getScrollY = () => {
      if (typeof window === 'undefined') return 0;
      try {
        if (window.lenis != null && typeof window.lenis.scroll === 'number') return window.lenis.scroll;
      } catch (_) {}
      return window.scrollY;
    };

    let rafId = null;
    const tick = () => {
      const scrollY = getScrollY();
      const last = lastScrollRef.current;
      const delta = scrollY - last;
      lastScrollRef.current = scrollY;

      if (scrollY <= TOP_ZONE || menuOpenRef.current) {
        setHeaderHidden(false);
      } else if (delta > DIRECTION_THRESHOLD && scrollY > SCROLL_THRESHOLD) {
        setHeaderHidden(true);
      } else if (delta < -DIRECTION_THRESHOLD) {
        setHeaderHidden(false);
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => {
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, []);

  // --- 2. MENU ANIMATION (FIXED) ---
  // Step A: Create the timeline ONCE on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
        tlRef.current = gsap.timeline({ paused: true })
            .to(menuOverlayRef.current, {
                y: '0%',
                duration: 0.8,
                ease: 'expo.inOut',
            })
            .fromTo('.menu-link-item',
                { y: 100, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out' },
                '-=0.4'
            )
            .fromTo('.menu-footer-info',
                { opacity: 0 },
                { opacity: 1, duration: 0.5 },
                '-=0.3'
            );
    }, headerRef); // Scope GSAP to this component

    return () => ctx.revert(); // Cleanup GSAP on unmount
  }, []);

  // Step B: Control the existing timeline when state changes
  useEffect(() => {
    if (isMenuOpen) {
      tlRef.current?.play();
      document.body.style.overflow = 'hidden';
    } else {
      tlRef.current?.reverse();
      document.body.style.overflow = '';
    }
  }, [isMenuOpen]);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // --- 3. HOVER IMAGE REVEAL LOGIC (desktop only; no hover on touch/mobile) ---
  const handleLinkHover = (imageSrc) => {
    if (isMobile) return;
    gsap.to(previewImageRef.current, {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        if (previewImageRef.current) {
          previewImageRef.current.style.backgroundImage = `url(${imageSrc})`;
          gsap.to(previewImageRef.current, { opacity: 0.3, duration: 0.4 });
        }
      }
    });
  };

  const handleLinkLeave = () => {
    if (isMobile) return;
    gsap.to(previewImageRef.current, { opacity: 0, duration: 0.3 });
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-[60] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isMenuOpen ? 'bg-transparent' : 'bg-white/80 backdrop-blur-md border-b border-white/10'
        } ${headerHidden ? '-translate-y-full' : 'translate-y-0'}`}
      >
        <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none"></div>
        
        <nav className="container mx-auto px-6 h-24 flex items-center justify-between relative z-50">
          {/* LOGO */}
          <Link href="/" className="relative z-50 h-32 w-auto flex items-center">
            <Image
              src="/logo.png"
              alt="PPC-United"
              width={500}
              height={500}
              className={`h-20 w-auto object-contain transition-all duration-300 ${isMenuOpen ? 'brightness-0 invert' : ''}`}
              priority
            />
          </Link>

          {/* HAMBURGER BUTTON */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="group relative z-50 flex items-center gap-3 focus:outline-none"
          >
            <span className={`text-sm font-bold tracking-widest uppercase mix-blend-difference ${isMenuOpen ? 'text-white' : 'text-stone-900'}`}>
              {isMenuOpen ? 'Close' : 'Menu'}
            </span>
            <div className="relative w-8 h-4 flex flex-col justify-between items-end">
                <span className={`w-full h-[2px] bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-[7px] bg-white' : 'bg-stone-900'}`} />
                <span className={`w-2/3 h-[2px] bg-current transition-all duration-300 group-hover:w-full ${isMenuOpen ? '-rotate-45 -translate-y-[7px] w-full bg-white' : 'bg-stone-900'}`} />
            </div>
          </button>
        </nav>
      </header>

      {/* --- FULLSCREEN MENU OVERLAY --- */}
      <div
        ref={menuOverlayRef}
        className="fixed inset-0 z-40 bg-stone-950 translate-y-[-100%]"
        style={{ willChange: 'transform' }}
      >
        {/* Background Preview Image */}
        <div 
            ref={previewImageRef}
            className="absolute inset-0 bg-cover bg-center opacity-0 transition-opacity pointer-events-none grayscale"
            style={{ backgroundImage: 'url(/logo.png)' }}
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="container mx-auto h-full px-6 md:px-12 pt-24 md:pt-32 pb-12 flex flex-col md:flex-row justify-between relative z-10">
            <div ref={menuContentRef} className="flex flex-col justify-center space-y-2">
                {menuItems.map((item, index) => (
                    <div key={item.href} className="overflow-hidden">
                        <a
                            href={item.href}
                            onMouseEnter={() => handleLinkHover(item.image)}
                            onMouseLeave={handleLinkLeave}
                            className="menu-link-item block text-4xl sm:text-6xl md:text-8xl font-black text-transparent text-stroke-white hover:text-white transition-colors duration-300 tracking-tighter uppercase px-2 md:px-4"
                            style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}
                        >
                            {item.label}
                        </a>
                    </div>
                ))}
            </div>

            <div className="menu-footer-info flex flex-col justify-end text-white/50 font-mono text-sm space-y-6 md:text-right">
                <div className="space-y-1">
                    <p className="uppercase tracking-widest text-white">Contact</p>
                    <p>info@ppc-united.com</p>
                    <p>+966 12 345 6789</p>
                </div>
                <div className="space-y-1">
                    <p className="uppercase tracking-widest text-white">Office</p>
                    <p>4386 Suwaid Ibn Qais Al Ansari St.</p>
                    <p> Al Madinah Kingdom of Saudi Arabia</p>
                </div>
                <div className="flex gap-4 md:justify-end text-white pt-4">
                    <a href="#" className="hover:text-brand transition-colors">LN</a>
                    <a href="#" className="hover:text-brand transition-colors">TW</a>
                    <a href="#" className="hover:text-brand transition-colors">IG</a>
                </div>
            </div>
        </div>
      </div>
    </>
  );
}