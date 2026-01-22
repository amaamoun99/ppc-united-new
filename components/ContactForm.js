'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';
import { Check } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [focusedField, setFocusedField] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const inputRefs = {
    name: useRef(null),
    email: useRef(null),
    message: useRef(null),
  };
  const buttonRef = useRef(null);

  const handleFocus = (field) => {
    setFocusedField(field);
    const input = inputRefs[field].current;
    if (input) {
      gsap.to(input, {
        borderColor: '#00478f',
        boxShadow: '0 0 20px rgba(0, 71, 143, 0.3)',
        duration: 0.3,
      });
    }
  };

  const handleBlur = (field) => {
    setFocusedField(null);
    const input = inputRefs[field].current;
    if (input && !input.value) {
      gsap.to(input, {
        borderColor: '#e5e7eb',
        boxShadow: '0 0 0px rgba(0, 71, 143, 0)',
        duration: 0.3,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Animate button to checkmark
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.8,
        duration: 0.3,
        onComplete: () => {
          setIsSubmitted(true);
          gsap.to(buttonRef.current, {
            scale: 1,
            duration: 0.3,
          });
        },
      });
    }

    // Reset after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="relative">
        <input
          ref={inputRefs.name}
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          onFocus={() => handleFocus('name')}
          onBlur={() => handleBlur('name')}
          placeholder="Name"
          className="w-full bg-transparent border-0 border-b-2 border-gray-300 pb-3 text-gray-900 text-lg focus:outline-none transition-colors"
          required
        />
      </div>

      <div className="relative">
        <input
          ref={inputRefs.email}
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          onFocus={() => handleFocus('email')}
          onBlur={() => handleBlur('email')}
          placeholder="Email"
          className="w-full bg-transparent border-0 border-b-2 border-gray-300 pb-3 text-gray-900 text-lg focus:outline-none transition-colors"
          required
        />
      </div>

      <div className="relative">
        <textarea
          ref={inputRefs.message}
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          onFocus={() => handleFocus('message')}
          onBlur={() => handleBlur('message')}
          placeholder="Message"
          rows={6}
          className="w-full bg-transparent border-0 border-b-2 border-gray-300 pb-3 text-gray-900 text-lg focus:outline-none transition-colors resize-none"
          required
        />
      </div>

      <button
        ref={buttonRef}
        type="submit"
        disabled={isSubmitted}
        className={`w-full py-4 px-8 bg-brand text-white text-lg font-semibold rounded-full transition-all ${
          isSubmitted
            ? 'bg-green-500'
            : 'hover:bg-brand-dark hover:scale-105'
        }`}
      >
        {isSubmitted ? (
          <span className="flex items-center justify-center gap-2">
            <Check className="w-6 h-6" />
            Sent!
          </span>
        ) : (
          'Send'
        )}
      </button>
    </form>
  );
}

