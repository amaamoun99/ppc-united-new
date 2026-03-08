'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { gsap } from '@/lib/gsap';
import Link from 'next/link';
import Image from 'next/image';

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const containerRef = useRef(null);
  const mainImageRef = useRef(null);

  useEffect(() => {
    const id = params?.id;
    if (!id) {
      setLoading(false);
      setError('Project not found');
      return;
    }
    fetch(`/api/projects/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Project not found');
        return res.json();
      })
      .then((data) => {
        setProject(data);
        setActiveImageIndex(0);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params?.id]);

  // 1. ENTRANCE ANIMATION
  useEffect(() => {
    if (!containerRef.current || !project) return;

    const tl = gsap.timeline();
    tl.to(containerRef.current, { opacity: 1, duration: 0.5 });
    if (mainImageRef.current && project.images?.length > 0) {
      tl.fromTo(
        mainImageRef.current,
        { scale: 1.1, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: 'power3.out' }
      );
    }
    tl.fromTo(
      '.animate-in',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power3.out' },
      '-=0.6'
    );
    return () => tl.kill();
  }, [project]);

  const changeActiveImage = (index) => {
    if (index === activeImageIndex || !mainImageRef.current || !project?.images?.length) return;
    gsap.to(mainImageRef.current, {
      opacity: 0,
      scale: 1.05,
      duration: 0.2,
      onComplete: () => {
        setActiveImageIndex(index);
        gsap.to(mainImageRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: 'power2.out',
        });
      },
    });
  };

  const handleBack = () => {
    gsap.to(containerRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.3,
      onComplete: () => router.push('/projects'),
    });
  };

  const categoryDisplay = project?.category === 'MEP' ? 'MEP' : project?.category === 'Civil' ? 'Civil' : project?.category || 'Finishing';
  const year = project?.completedAt
    ? new Date(project.completedAt).getFullYear()
    : project?.createdAt
      ? new Date(project.createdAt).getFullYear()
      : '—';
  const images = project?.images ?? [];
  const hasImages = images.length > 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-stone-500 font-medium">Loading project…</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-600 mb-4">Project not found.</p>
          <Link href="/projects" className="text-stone-900 font-semibold underline">
            Back to projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-stone-50 opacity-0">
      <nav className="fixed top-24 left-0 w-full z-50 px-4 md:px-12 flex justify-between items-start pointer-events-none">
        <button
          onClick={handleBack}
          className="pointer-events-auto bg-white/80 backdrop-blur-md border border-white/20 text-stone-900 px-5 py-3 min-h-[44px] rounded-full font-bold text-sm uppercase tracking-widest hover:bg-stone-900 hover:text-white transition-colors shadow-lg flex items-center gap-2 group"
        >
          <span>←</span> Back
        </button>
      </nav>

      <div className="container mx-auto px-4 md:px-6 py-20 md:py-32">
        {/* GALLERY: main image + thumbnails */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 mb-12 md:mb-20 min-h-[50vh] lg:min-h-[700px]">
          <div className="lg:col-span-9 relative rounded-xl md:rounded-2xl overflow-hidden bg-stone-200 shadow-2xl group min-h-[280px] md:min-h-[400px]">
            {hasImages ? (
              <>
                <Image
                  ref={mainImageRef}
                  src={images[activeImageIndex]}
                  alt={project.title}
                  fill
                  className="object-cover will-change-transform"
                  priority
                  unoptimized={images[activeImageIndex]?.startsWith('https://storage.googleapis.com')}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-stone-400 text-lg">
                No image
              </div>
            )}
            <div className="animate-in absolute bottom-4 left-4 md:bottom-12 md:left-12 text-white p-3 md:p-4">
              <span className="inline-block px-3 py-1 border border-white/30 rounded-full bg-black/20 backdrop-blur-md text-xs font-mono uppercase tracking-widest mb-2 md:mb-4">
                {categoryDisplay}
              </span>
              <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-none">
                {project.title}
              </h1>
            </div>
          </div>

          {hasImages && images.length > 1 && (
            <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2 md:gap-4 lg:h-full min-h-[72px] lg:min-h-0">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => changeActiveImage(index)}
                  className={`animate-in relative flex-1 lg:flex-none rounded-lg md:rounded-xl overflow-hidden transition-all duration-300 group min-h-[72px] md:min-h-[80px] ${
                    activeImageIndex === index
                      ? 'ring-2 ring-stone-900 ring-offset-2 opacity-100'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`View ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    unoptimized={img?.startsWith('https://storage.googleapis.com')}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-24">
          <div className="animate-in md:col-span-4 space-y-6 md:space-y-8 border-t border-stone-200 pt-6 md:pt-8">
            <h3 className="text-sm font-mono uppercase tracking-widest text-stone-400">Project Specs</h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <span className="block text-xs uppercase text-stone-500 mb-1">Location</span>
                <p className="text-xl font-bold text-stone-900">{project.location}</p>
              </div>
              <div>
                <span className="block text-xs uppercase text-stone-500 mb-1">Year</span>
                <p className="text-xl font-bold text-stone-900">{year}</p>
              </div>
              <div>
                <span className="block text-xs uppercase text-stone-500 mb-1">Scope</span>
                <p className="text-xl font-bold text-stone-900">{categoryDisplay} Engineering</p>
              </div>
            </div>
          </div>

          <div className="animate-in md:col-span-8 border-t border-stone-200 pt-6 md:pt-8">
            <h3 className="text-sm font-mono uppercase tracking-widest text-stone-400 mb-4 md:mb-6">The Concept</h3>
            <p className="text-xl md:text-2xl lg:text-3xl font-serif italic text-stone-800 leading-relaxed mb-6 md:mb-8">
              &quot;{project.description}&quot;
            </p>
            <div className="text-lg text-stone-600 space-y-6 leading-relaxed">
              <p>
                Our team approached this project with a focus on precision and sustainability.
                By utilizing advanced BIM modeling, we ensured that every MEP system integrated
                flawlessly with the architectural vision.
              </p>
              <p>
                The result is a facility that not only meets international standards but sets a new
                benchmark for {categoryDisplay} construction in the region.
              </p>
            </div>
            <div className="mt-12">
              <Link
                href="/contact"
                className="inline-flex items-center gap-4 text-stone-900 font-bold uppercase tracking-widest hover:gap-6 transition-all group"
              >
                Start a Project Like This <span className="text-2xl group-hover:text-brand">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
