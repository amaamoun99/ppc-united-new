'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';

export default function ContactPage() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Refs
  const sectionRef = useRef(null);
  const containerRef = useRef(null); 
  const formRef = useRef(null);      
  const ctaTextRef = useRef(null);   

  // 1. OPEN FORM ANIMATION
  const openForm = () => {
    setIsOpen(true);
    const tl = gsap.timeline();

    // A. Hide the CTA text smoothly
    tl.to(ctaTextRef.current, {
        y: -50,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in"
    });

    // B. "Morph" the button into the form container
    tl.to(containerRef.current, {
        clipPath: "inset(0% 0% 0% 0%)", // Expand to full size
        duration: 0.8,
        ease: "expo.inOut"
    }, "-=0.2");

    // C. Animate the Form Elements IN
    tl.fromTo(".form-element", 
        { y: 50, opacity: 0 },
        { 
            y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: "back.out(1.7)" 
        }, "-=0.4"
    );
  };

  // 2. CLOSE FORM ANIMATION
  const closeForm = () => {
    const tl = gsap.timeline({
        onComplete: () => setIsOpen(false)
    });

    // A. Hide Form Elements
    tl.to(".form-element", {
        y: 20, opacity: 0, duration: 0.3, stagger: -0.05, ease: "power2.in"
    });

    // B. Shrink container back to "Button" size
    tl.to(containerRef.current, {
        clipPath: "inset(10% 5% 10% 5%)", // Adjust based on your preferred closed size
        duration: 0.7,
        ease: "expo.inOut"
    });

    // C. Bring back CTA Text
    tl.to(ctaTextRef.current, {
        y: 0, opacity: 1, duration: 0.5, ease: "power2.out"
    }, "-=0.3");
  };

  // 3. INITIAL SETUP
  useEffect(() => {
    // Initial closed state size
    // Adjust these values to control how big the "Blue Box" is before clicking
    gsap.set(containerRef.current, { 
        clipPath: "inset(10% 5% 10% 5%)" 
    });
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen bg-stone-950 flex items-center justify-center overflow-hidden">
      
      {/* --- BACKGROUND AMBIANCE --- */}
      <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-brand/10 rounded-full blur-[100px] animate-pulse-slow" />
      </div>

      {/* --- LAYER 1: THE CTA & INFO (Visible Initially) --- */}
      <div 
        ref={ctaTextRef} 
        className="relative z-10 text-center flex flex-col items-center pointer-events-none w-full max-w-4xl px-4"
      >
        <h2 className="text-6xl md:text-9xl font-black text-white mb-8 tracking-tighter mix-blend-difference leading-none">
            LET'S<br/>BUILD.
        </h2>
        
        {/* Contact Info Grid (Visible behind the blue box) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white/50 font-mono text-sm uppercase tracking-widest mt-12 w-full">
            <div>
                <span className="block text-brand mb-2">Email</span>
                info@ppc-united.com
            </div>
             <div>
                <span className="block text-brand mb-2">Phone</span>
                +966 12 345 6789
            </div>
             <div>
                <span className="block text-brand mb-2">Location</span>
                Riyadh, Saudi Arabia
            </div>
        </div>

        <div className="text-brand font-mono uppercase tracking-widest text-sm animate-bounce mt-32">
            ( Click Box to Start )
        </div>
      </div>

      {/* --- LAYER 2: THE MORPHING CONTAINER --- */}
      <div 
        ref={containerRef}
        onClick={!isOpen ? openForm : undefined}
        className={`
            absolute z-20 bg-brand w-full h-full flex items-center justify-center transition-colors duration-700
            ${!isOpen ? 'cursor-pointer hover:bg-brand-light' : 'bg-stone-100 cursor-default'}
        `}
      >
        {/* THE TRIGGER TEXT (Visible when closed) */}
        {!isOpen && (
            <div className="text-center pointer-events-none">
                <span className="text-white font-black text-4xl md:text-6xl tracking-tighter uppercase block">
                    Contact US
                </span>
                <span className="text-white/60 font-mono text-sm uppercase tracking-widest mt-4 block">
                    Tap to Open Inquiry Form
                </span>
            </div>
        )}

        {/* --- THE FORM CONTENT (Hidden inside the clip-path initially) --- */}
        <div ref={formRef} className={`w-full max-w-2xl px-8 ${!isOpen ? 'pointer-events-none' : ''}`}>
            
            {/* Header */}
            <div className="flex justify-between items-end mb-12 form-element opacity-0">
                <h3 className="text-4xl font-bold text-stone-900">Project Details.</h3>
                <button 
                    onClick={(e) => { e.stopPropagation(); closeForm(); }}
                    className="text-sm font-mono text-stone-500 hover:text-red-500 uppercase tracking-widest"
                >
                    [ Close ]
                </button>
            </div>

            {/* Inputs */}
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="group form-element opacity-0">
                        <label className="block text-xs font-mono text-stone-400 uppercase mb-2">My Name is</label>
                        <input type="text" placeholder="John Doe" className="w-full bg-transparent border-b border-stone-300 py-2 text-xl text-stone-900 focus:outline-none focus:border-brand transition-colors" />
                    </div>
                    <div className="group form-element opacity-0">
                        <label className="block text-xs font-mono text-stone-400 uppercase mb-2">Email Address</label>
                        <input type="email" placeholder="john@example.com" className="w-full bg-transparent border-b border-stone-300 py-2 text-xl text-stone-900 focus:outline-none focus:border-brand transition-colors" />
                    </div>
                </div>

                <div className="group form-element opacity-0">
                    <label className="block text-xs font-mono text-stone-400 uppercase mb-2">Phone Number</label>
                    <input type="tel" placeholder="+966 ..." className="w-full bg-transparent border-b border-stone-300 py-2 text-xl text-stone-900 focus:outline-none focus:border-brand transition-colors" />
                </div>

                <div className="group form-element opacity-0">
                    <label className="block text-xs font-mono text-stone-400 uppercase mb-2">Tell us about your project</label>
                    <textarea rows="3" placeholder="We need a MEP solution for..." className="w-full bg-transparent border-b border-stone-300 py-2 text-xl text-stone-900 focus:outline-none focus:border-brand transition-colors resize-none" />
                </div>

                <div className="pt-8 form-element opacity-0">
                    <button className="w-full bg-stone-900 text-white py-6 rounded-none hover:bg-brand transition-colors text-lg font-bold tracking-widest uppercase">
                        Send Inquiry
                    </button>
                </div>
            </form>
        </div>

      </div>
    </section>
  );
}