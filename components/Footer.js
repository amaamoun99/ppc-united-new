'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import Image from 'next/image';
import Link from 'next/link';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const SITEMAP = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact', href: '/contact' },
  { label: 'About', href: '/about' },
];

export default function Footer() {
  const footerRef = useRef(null);
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const { isMobile } = useMediaQuery();

  useEffect(() => {
    if (isMobile) return;
    const footer = footerRef.current;
    const container = containerRef.current;
    const title = titleRef.current;
    if (!footer || !container || !title) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(container,
        { yPercent: -50 },
        {
          yPercent: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: footer,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: true,
          },
        }
      );
      gsap.fromTo(title,
        { letterSpacing: '-0.1em', opacity: 0 },
        {
          letterSpacing: '0em',
          opacity: 0.1,
          ease: 'none',
          scrollTrigger: {
            trigger: footer,
            start: 'top 80%',
            end: 'bottom bottom',
            scrub: 1.5,
          },
        }
      );
      ScrollTrigger.refresh();
    }, footer);

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <footer
      ref={footerRef}
      className="relative w-full min-w-full bg-blue-950 text-white z-30 flex flex-col overflow-hidden min-h-0 md:min-h-[80vh]"
    >
      {/* Background logo — smaller on mobile so layout isn't dominated */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <div
          ref={titleRef}
          className="relative w-[70vw] h-[70vw] md:w-[60vw] md:h-[60vw]"
          style={{ position: 'relative' }}
        >
          <Image
            src="/logo.png"
            alt=""
            fill
            className="object-contain opacity-[0.08] md:opacity-[0.1]"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </div>
      </div>

      {/* Top border */}
      <div className="absolute top-0 left-0 w-full h-px bg-blue-800/30 z-10">
        <div className="absolute top-0 left-0 h-full w-[20%] bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scan" />
      </div>

      {/* CTA section — outside parallax so it always stays visible on all pages (contact, about, home) */}
      <div className="relative z-10 shrink-0">
        <div className="container mx-auto w-full min-w-full px-4 sm:px-6 pt-12 md:pt-20">
          <div className="flex flex-col sm:flex-row sm:flex-nowrap sm:justify-between sm:items-end gap-8 sm:gap-12 border-b border-blue-500/20 pb-10 md:pb-12">
            <div className="max-w-xl">
              <span className="text-blue-400 font-mono text-xs md:text-sm tracking-widest uppercase block mb-2 md:mb-4">
                Next Steps
              </span>
              <h2 className="text-3xl sm:text-5xl md:text-8xl font-bold tracking-tighter leading-tight">
                Ready to build the future?
              </h2>
            </div>
            <a
              href="mailto:info@ppc-united.com"
              className="group relative inline-flex items-center justify-center rounded-full border border-blue-500/30 overflow-hidden hover:border-blue-400 transition-colors duration-300 shrink-0 w-32 h-32 sm:w-36 sm:h-36 md:w-48 md:h-48 self-start md:self-end"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-500 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-full origin-center" />
              <span className="relative z-10 text-base sm:text-xl font-bold group-hover:text-white transition-colors">
                Email US
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Parallax section — only this part moves on desktop; CTA above is fixed */}
      <div ref={containerRef} className="relative z-10 flex flex-col flex-1 w-full min-h-0">
        <div className="container mx-auto w-full min-w-full px-4 sm:px-6 pb-8 md:pb-12">
          {/* Links & brand — one column on mobile, grid on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 sm:gap-12 py-8 md:py-12">
            <div className="sm:col-span-2 flex flex-col gap-4 sm:gap-0">
              <Link href="/" className="w-fit">
                <Image
                  src="/logo.png"
                  alt="PPC-United"
                  width={200}
                  height={48}
                  className="h-10 md:h-12 w-auto object-contain brightness-0 invert"
                />
              </Link>
              <p className="text-white/60 text-sm md:text-lg leading-relaxed max-w-md">
                Engineering Excellence in Saudi Arabia. Delivering precision across MEP, Finishing, and Medical infrastructure since 2010.
              </p>
            </div>

            <div>
              <h4 className="text-xs md:text-sm font-mono text-blue-300/70 uppercase tracking-widest mb-3 md:mb-6">
                Sitemap
              </h4>
              <ul className="space-y-2.5 md:space-y-4">
                {SITEMAP.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm md:text-lg text-white/90 hover:text-blue-400 transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs md:text-sm font-mono text-blue-300/70 uppercase tracking-widest mb-3 md:mb-6">
                Socials
              </h4>
              <ul className="space-y-2.5 md:space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-sm md:text-lg text-white/90 hover:text-blue-400 transition-colors"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-6 border-t border-blue-500/20 text-blue-300/50 text-xs md:text-sm font-mono uppercase">
            <span>&copy; {new Date().getFullYear()} PPC-United.</span>
            <span>Riyadh, KSA</span>
            <a
              href="https://maamoun.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
            >
              Made with love: maamoun.dev
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}