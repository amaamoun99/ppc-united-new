'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { gsap } from '@/lib/gsap';
import Link from 'next/link';
import Image from 'next/image';

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const containerRef = useRef(null);
  const mainImageRef = useRef(null);

  useEffect(() => {
    const slug = params?.slug;
    if (!slug) {
      setLoading(false);
      setError('Article not found');
      return;
    }
    fetch(`/api/news/slug/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Article not found');
        return res.json();
      })
      .then((data) => {
        setArticle(data);
        setActiveImageIndex(0);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params?.slug]);

  useEffect(() => {
    if (!containerRef.current || !article) return;

    const tl = gsap.timeline();
    tl.to(containerRef.current, { opacity: 1, duration: 0.5 });
    if (mainImageRef.current && article.images?.length > 0) {
      tl.fromTo(
        mainImageRef.current,
        { scale: 1.05, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
    }
    tl.fromTo(
      '.animate-in',
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power3.out' },
      '-=0.5'
    );
    return () => tl.kill();
  }, [article]);

  const handleBack = () => {
    gsap.to(containerRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.3,
      onComplete: () => router.push('/'),
    });
  };

  const dateStr = article?.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—';
  const images = article?.images ?? [];
  const hasImages = images.length > 0;
  const mainImage = hasImages ? images[activeImageIndex] : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-800 via-blue-900 to-blue-950 flex items-center justify-center">
        <p className="text-blue-200/80 font-medium">Loading article…</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-800 via-blue-900 to-blue-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-blue-200/80 mb-4">Article not found.</p>
          <Link
            href="/"
            className="text-blue-400 font-semibold hover:text-blue-300 underline"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-b from-blue-800 via-blue-900 to-blue-950 text-white opacity-0 border-t border-blue-500/20"
    >
      <nav className="fixed top-24 left-0 w-full z-50 px-4 md:px-12 flex justify-between items-start pointer-events-none">
        <button
          onClick={handleBack}
          className="pointer-events-auto bg-blue-900/80 backdrop-blur-md border border-blue-500/30 text-white px-5 py-3 min-h-[44px] rounded-full font-bold text-sm uppercase tracking-widest hover:bg-blue-500/20 hover:border-blue-400/50 transition-colors shadow-lg flex items-center gap-2 group"
        >
          <span>←</span> Back
        </button>
      </nav>

      <article className="container mx-auto px-4 md:px-6 pt-20 md:pt-24 pb-24 md:pb-32">
        {/* Hero: cover image + title block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8 lg:gap-12 mb-12 md:mb-16">
          <div className="lg:col-span-8 relative aspect-[16/10] rounded-lg md:rounded-xl overflow-hidden bg-blue-900/50 border border-blue-500/20 min-h-[220px] md:min-h-[280px]">
            {hasImages ? (
              <>
                <Image
                  ref={mainImageRef}
                  src={mainImage}
                  alt={article.title}
                  fill
                  className="object-cover will-change-transform"
                  priority
                  unoptimized={mainImage?.startsWith('https://storage.googleapis.com')}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-transparent to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-blue-400/50 text-lg">
                No image
              </div>
            )}
            <div className="animate-in absolute bottom-4 left-4 md:bottom-8 md:left-8 right-4 md:right-8">
              <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-2 md:mb-4">
                <span className="font-mono text-xs border border-blue-400/30 px-2 py-1 rounded text-blue-300">
                  News
                </span>
                <span className="font-mono text-xs text-blue-200/80">{dateStr}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-tight">
                {article.title}
              </h1>
            </div>
          </div>

          {hasImages && images.length > 1 && (
            <div className="lg:col-span-4 flex flex-row lg:flex-col gap-2 md:gap-3 min-h-[80px] lg:min-h-0">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`animate-in relative flex-1 lg:flex-none min-h-[72px] md:min-h-[100px] lg:min-h-[120px] rounded-lg overflow-hidden transition-all duration-300 border ${
                    activeImageIndex === index
                      ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-blue-950 opacity-100 border-blue-400/50'
                      : 'opacity-60 hover:opacity-100 border-blue-500/20'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`View ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    unoptimized={img?.startsWith('https://storage.googleapis.com')}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Excerpt */}
        {article.excerpt && (
          <div className="animate-in border-l-2 border-blue-500/50 pl-4 md:pl-6 mb-8 md:mb-12">
            <p className="text-lg md:text-xl lg:text-2xl text-blue-200/90 leading-relaxed font-medium">
              {article.excerpt}
            </p>
          </div>
        )}

        {/* Body */}
        <div className="animate-in max-w-3xl">
          <div
            className="prose prose-invert prose-base md:prose-lg max-w-none text-blue-200/90 leading-relaxed prose-headings:text-white prose-headings:font-bold prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-white"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* CTA */}
        <div className="animate-in mt-12 md:mt-16 pt-8 md:pt-12 border-t border-blue-500/20 flex flex-wrap items-center gap-2 md:gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-300/80 font-medium text-sm md:text-base hover:text-blue-200 transition-colors"
          >
            Home
          </Link>
          <span className="text-blue-500/40 hidden md:inline">|</span>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 md:gap-3 text-blue-400 font-bold uppercase tracking-widest hover:text-blue-300 transition-colors group min-h-[44px] items-center"
          >
            Get in touch
            <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </article>
    </div>
  );
}
