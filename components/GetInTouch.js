'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export default function GetInTouch() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Refs
  const sectionRef = useRef(null);
  const containerRef = useRef(null); // The expanding container
  const buttonRef = useRef(null);    // The trigger button
  const formRef = useRef(null);      // The actual form content
  const ctaTextRef = useRef(null);   // The "Ready to start" text

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
    // We do this by expanding the Clip Path from the center
    tl.to(containerRef.current, {
        clipPath: "inset(0% 0% 0% 0%)", // Expand to full size
        duration: 0.8,
        ease: "expo.inOut" // The "Dramatic" easing
    }, "-=0.2");

    // C. Animate the Form Elements IN (Staggered)
    tl.fromTo(".form-element", 
        { y: 50, opacity: 0 },
        { 
            y: 0, 
            opacity: 1, 
            stagger: 0.1, 
            duration: 0.5,
            ease: "back.out(1.7)" 
        }, "-=0.4"
    );
  };

  // 2. CLOSE FORM ANIMATION
  const closeForm = () => {
    const tl = gsap.timeline({
        onComplete: () => setIsOpen(false) // Reset state after anim
    });

    // A. Hide Form Elements
    tl.to(".form-element", {
        y: 20,
        opacity: 0,
        duration: 0.3,
        stagger: -0.05, // Reverse stagger
        ease: "power2.in"
    });

    // B. Shrink container back to "Button" size
    tl.to(containerRef.current, {
        clipPath: "inset(45% 42% 45% 42%)", // Matches the initial button size roughly
        duration: 0.7,
        ease: "expo.inOut"
    });

    // C. Bring back CTA Text
    tl.to(ctaTextRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out"
    }, "-=0.3");
  };

  // 3. INITIAL SETUP
  useEffect(() => {
    // Set initial state of the container (It should look like the button initially)
    // We use clip-path to "hide" the form parts and make the container look like a small box
    // Adjust these % values to match the button size perfectly
    gsap.set(containerRef.current, { 
        clipPath: "inset(45% 40% 45% 40%)" 
    });
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen bg-stone-950 flex items-center justify-center overflow-hidden z-10">
      
      {/* --- BACKGROUND AMBIANCE --- */}
      <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-brand/10 rounded-full blur-[100px] animate-pulse-slow" />
      </div>

      {/* --- LAYER 1: THE CTA (Visible Initially) --- */}
      <div 
        ref={ctaTextRef} 
        className="relative z-10 text-center flex flex-col items-center pointer-events-none" // pointer-events-none so clicks go through to the container behind
      >
        <h2 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter mix-blend-difference">
            HAVE AN IDEA?
        </h2>
        {/* Visual-only button label (The actual click happens on the container below) */}
        <div className="text-brand font-mono uppercase tracking-widest text-sm animate-bounce mt-48">
            ( Click to Open )
        </div>
      </div>

      {/* --- LAYER 2: THE MORPHING CONTAINER --- */}
      {/* This acts as the button initially, then expands to become the form card */}
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
            <span className="text-white font-bold text-xl tracking-widest uppercase absolute z-30 pointer-events-none">
                Lets work Together
            </span>
        )}

        {/* --- THE FORM CONTENT (Hidden inside the clip-path initially) --- */}
        <div ref={formRef} className={`w-full max-w-2xl px-8 ${!isOpen ? 'pointer-events-none' : ''}`}>
            
            {/* Header */}
            <div className="flex justify-between items-end mb-12 form-element opacity-0">
                <h3 className="text-4xl font-bold text-stone-900">Let's Build.</h3>
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