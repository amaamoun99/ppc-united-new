'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export default function GetInTouch() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitStatus, setSubmitStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [submitMessage, setSubmitMessage] = useState('');
  
  // Refs
  const sectionRef = useRef(null);
  const containerRef = useRef(null); // The expanding container
  const buttonRef = useRef(null);    // The trigger button
  const formRef = useRef(null);      // The actual form content
  const ctaTextRef = useRef(null);   // The Ready to start text

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

    // B. Morph the button into the form container
    // We do this by expanding the Clip Path from the center
    tl.to(containerRef.current, {
        clipPath: "inset(0% 0% 0% 0%)", // Expand to full size
        duration: 0.8,
        ease: "expo.inOut" // The Dramatic easing
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

    // B. Shrink container back to Button size
    tl.to(containerRef.current, {
        clipPath: "inset(42% 15% 42% 15%)", // Wide enough for full "Let's work Together" text
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
    // Initial clip: wide enough so full "Let's work Together" has blue bg (inset top right bottom left)
    gsap.set(containerRef.current, { 
        clipPath: "inset(42% 15% 42% 15%)" 
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (submitStatus) setSubmitStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('loading');
    setSubmitMessage('');
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || null,
          message: formData.message.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSubmitStatus('error');
        setSubmitMessage(data.error || 'Failed to send inquiry.');
        return;
      }
      setSubmitStatus('success');
      setSubmitMessage('Thank you! We’ll get back to you soon.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setSubmitStatus('error');
      setSubmitMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <section ref={sectionRef} className="relative h-screen bg-gradient-to-b from-blue-950 via-stone-950 to-stone-950 flex items-center justify-center overflow-hidden z-10">
      
      {/* --- BACKGROUND AMBIANCE --- */}
      <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] bg-brand/10 rounded-full blur-[80px] animate-pulse-slow" />
      </div>

      {/* --- LAYER 1: THE CTA (Visible Initially) --- */}
      <div 
        ref={ctaTextRef} 
        className="relative z-10 text-center flex flex-col items-center pointer-events-none" // pointer-events-none so clicks go through to the container behind
      >
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black text-white mb-8 tracking-tighter mix-blend-difference px-4">
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
        {/* THE TRIGGER TEXT (Visible when closed) — wrapped so it stays within visible clip */}
        {!isOpen && (
            <span className="text-white font-bold text-lg sm:text-xl tracking-widest uppercase absolute z-30 pointer-events-none whitespace-nowrap px-6">
                Let&apos;s work Together
            </span>
        )}

        {/* --- THE FORM CONTENT (Hidden inside the clip-path initially) --- */}
        <div ref={formRef} className={`w-full max-w-2xl px-8 ${!isOpen ? 'pointer-events-none' : ''}`}>
            
            {/* Header */}
            <div className="flex justify-between items-end mb-12 form-element opacity-0">
                <h3 className="text-4xl font-bold text-stone-900">Let&apos;s Build.</h3>
                <button 
                    onClick={(e) => { e.stopPropagation(); closeForm(); }}
                    className="text-sm font-mono text-stone-500 hover:text-red-500 uppercase tracking-widest"
                >
                    [ Close ]
                </button>
            </div>

            {/* Inputs */}
            <form className="space-y-8" onSubmit={handleSubmit}>
                {submitMessage && (
                  <div className={`form-element opacity-0 text-sm font-medium px-4 py-3 rounded ${submitStatus === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {submitMessage}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="group form-element opacity-0">
                        <label htmlFor="inquiry-name" className="block text-xs font-mono text-stone-400 uppercase mb-2">My Name is</label>
                        <input id="inquiry-name" name="name" type="text" placeholder="John Doe" value={formData.name} onChange={handleInputChange} className="w-full bg-transparent border-b border-stone-300 py-2 text-xl text-stone-900 focus:outline-none focus:border-brand transition-colors" required />
                    </div>
                    <div className="group form-element opacity-0">
                        <label htmlFor="inquiry-email" className="block text-xs font-mono text-stone-400 uppercase mb-2">Email Address</label>
                        <input id="inquiry-email" name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleInputChange} className="w-full bg-transparent border-b border-stone-300 py-2 text-xl text-stone-900 focus:outline-none focus:border-brand transition-colors" required />
                    </div>
                </div>

                <div className="group form-element opacity-0">
                    <label htmlFor="inquiry-phone" className="block text-xs font-mono text-stone-400 uppercase mb-2">Phone Number</label>
                    <input id="inquiry-phone" name="phone" type="tel" placeholder="+966 ..." value={formData.phone} onChange={handleInputChange} className="w-full bg-transparent border-b border-stone-300 py-2 text-xl text-stone-900 focus:outline-none focus:border-brand transition-colors" />
                </div>

                <div className="group form-element opacity-0">
                    <label htmlFor="inquiry-message" className="block text-xs font-mono text-stone-400 uppercase mb-2">Tell us about your project</label>
                    <textarea id="inquiry-message" name="message" rows="3" placeholder="We need a MEP solution for..." value={formData.message} onChange={handleInputChange} className="w-full bg-transparent border-b border-stone-300 py-2 text-xl text-stone-900 focus:outline-none focus:border-brand transition-colors resize-none" required />
                </div>

                <div className="pt-8 form-element opacity-0">
                    <button type="submit" disabled={submitStatus === 'loading'} className="w-full bg-stone-900 text-white py-6 rounded-none hover:bg-brand transition-colors text-lg font-bold tracking-widest uppercase disabled:opacity-60 disabled:cursor-not-allowed">
                        {submitStatus === 'loading' ? 'Sending…' : 'Send Inquiry'}
                    </button>
                </div>
            </form>
        </div>

      </div>
    </section>
  );
}