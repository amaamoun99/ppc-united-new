'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from '../ImageUploader';
import LoadingOverlay from '../LoadingOverlay';

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function NewsForm({ initialData = null }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loadingState, setLoadingState] = useState({ stage: null, progress: null });
  const [error, setError] = useState('');
  const [images, setImages] = useState(initialData?.images ?? []);
  const imagesRef = useRef(initialData?.images ?? []);

  const setImagesAndRef = useCallback((urls) => {
    imagesRef.current = Array.isArray(urls) ? urls : [];
    setImages(imagesRef.current);
  }, []);

  const handleUploadStateChange = useCallback((uploading, progress) => {
    if (uploading) {
      setLoadingState({ stage: 'uploading', progress });
    } else {
      setLoadingState((prev) => (prev.stage === 'uploading' ? { stage: null, progress: null } : prev));
    }
  }, []);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    published: initialData?.published ?? false,
    isFeatured: initialData?.isFeatured ?? false,
    priority: initialData?.priority ?? 0,
  });

  useEffect(() => {
    if (!initialData && formData.title) {
      setFormData((prev) => ({ ...prev, slug: generateSlug(formData.title) }));
    }
  }, [formData.title, initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
    }));
  };

  const saveArticle = async (imagesToSave, closeAfterSave) => {
    setError('');
    setLoadingState({ stage: 'saving', progress: null });
    try {
      let savedId = initialData?.id;
      if (initialData) {
        const body = {
          ...formData,
          priority: Number(formData.priority),
          images: imagesToSave,
        };
        const res = await fetch(`/api/news/${initialData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error('Failed to save article');
      } else {
        const createBody = {
          ...formData,
          priority: Number(formData.priority),
          images: [],
        };
        const res = await fetch('/api/news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(createBody),
        });
        if (!res.ok) throw new Error('Failed to create article');
        const article = await res.json();
        savedId = article.id;
        if (imagesToSave.length > 0) {
          const patchRes = await fetch(`/api/news/${article.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ images: imagesToSave }),
          });
          if (!patchRes.ok) throw new Error('Failed to save images');
        }
      }
      setLoadingState({ stage: 'finalizing', progress: null });
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (closeAfterSave) {
        router.push('/admin/news');
        router.refresh();
      } else {
        setLoadingState({ stage: null, progress: null });
        if (!initialData && savedId) {
          router.replace(`/admin/news/${savedId}/edit`);
          router.refresh();
        }
      }
    } catch (err) {
      setError(err.message);
      setLoadingState({ stage: null, progress: null });
    }
  };

  const handleSaveFromStep1 = (closeAfterSave) => {
    const imagesToSave = initialData ? (imagesRef.current ?? initialData.images ?? []) : [];
    saveArticle(imagesToSave, closeAfterSave);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    const imagesToSave = imagesRef.current ?? [];
    saveArticle(imagesToSave, true);
  };

  return (
    <>
      <LoadingOverlay
        isVisible={loadingState.stage != null}
        stage={loadingState.stage}
        progress={loadingState.progress}
        entityLabel="article"
      />
      <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {step === 1 && (
        <>
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-white mb-2">
              Article Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white border border-[var(--blue-500)]/40 rounded-xl text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-[var(--blue-500)] focus:border-transparent transition-all"
              placeholder="Enter article title"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-semibold text-white mb-2">
              Slug *
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white border border-[var(--blue-500)]/40 rounded-xl text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-[var(--blue-500)] focus:border-transparent transition-all"
              placeholder="article-slug"
            />
            <p className="mt-1 text-xs text-white/50">
              Auto-generated from title. Edit if needed.
            </p>
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-semibold text-white mb-2">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-white border border-[var(--blue-500)]/40 rounded-xl text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-[var(--blue-500)] focus:border-transparent transition-all resize-none"
              placeholder="Short summary for listing pages"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-semibold text-white mb-2">
              Content *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={10}
              className="w-full px-4 py-3 bg-white border border-[var(--blue-500)]/40 rounded-xl text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-[var(--blue-500)] focus:border-transparent transition-all resize-none"
              placeholder="Full article content"
            />
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-semibold text-white mb-2">
              Priority (higher = appears first)
            </label>
            <input
              type="number"
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              min={0}
              className="w-full px-4 py-3 bg-white border border-[var(--blue-500)]/40 rounded-xl text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-[var(--blue-500)] focus:border-transparent transition-all"
              placeholder="0"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={handleChange}
                className="w-5 h-5 bg-white border border-[var(--blue-500)]/40 rounded text-[var(--blue-500)] focus:ring-2 focus:ring-[var(--blue-500)] focus:ring-offset-0"
              />
              <span className="text-sm font-semibold text-white">Publish this article</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-5 h-5 bg-white border border-[var(--blue-500)]/40 rounded text-[var(--blue-500)] focus:ring-2 focus:ring-[var(--blue-500)] focus:ring-offset-0"
              />
              <span className="text-sm font-semibold text-white">Feature this article on the homepage</span>
            </label>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.push('/admin/news')}
              className="px-6 py-3 bg-[var(--blue-800)]/50 hover:bg-[var(--blue-700)]/50 text-white font-semibold rounded-xl border border-[var(--blue-500)]/30 transition-all duration-300"
            >
              Close
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-6 bg-gradient-to-r from-[var(--blue-600)] to-[var(--blue-500)] hover:from-[var(--blue-500)] hover:to-[var(--blue-400)] text-white font-bold rounded-xl shadow-lg shadow-[var(--blue-500)]/30 transition-all duration-300"
            >
              Next: Upload Images
            </button>
            <button
              type="button"
              disabled={loadingState.stage != null}
              onClick={() => handleSaveFromStep1(true)}
              className="px-6 py-3 bg-[var(--blue-700)]/80 hover:bg-[var(--blue-600)]/80 text-white font-semibold rounded-xl border border-[var(--blue-500)]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingState.stage != null ? 'Saving...' : 'Save and close'}
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div>
            <h3 className="text-lg font-bold text-white mb-3">Image Management</h3>
            <p className="text-sm text-white/80 mb-4">
              First image is the primary/cover. Drag to reorder (max 10, 1MB each).
            </p>
            <ImageUploader
              value={images}
              onChange={setImagesAndRef}
              folder="news"
              maxImages={10}
              onUploadStateChange={handleUploadStateChange}
            />
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-6 py-3 bg-[var(--blue-800)]/50 hover:bg-[var(--blue-700)]/50 text-white font-semibold rounded-xl border border-[var(--blue-500)]/30 transition-all duration-300"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loadingState.stage != null}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-[var(--blue-600)] to-[var(--blue-500)] hover:from-[var(--blue-500)] hover:to-[var(--blue-400)] text-white font-bold rounded-xl shadow-lg shadow-[var(--blue-500)]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingState.stage != null ? 'Saving...' : 'Save and close'}
            </button>
          </div>
        </>
      )}
    </form>
    </>
  );
}
