'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from '../ImageUploader';
import LoadingOverlay from '../LoadingOverlay';

export default function ProjectForm({ initialData = null }) {
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
    description: initialData?.description || '',
    category: initialData?.category || 'MEP',
    location: initialData?.location || '',
    slug: initialData?.slug || '',
    startDate: initialData?.startDate
      ? new Date(initialData.startDate).toISOString().split('T')[0]
      : '',
    budget: initialData?.budget || '',
    status: initialData?.status || 'ACTIVE',
    completedAt: initialData?.completedAt
      ? new Date(initialData.completedAt).toISOString().split('T')[0]
      : '',
    isFeatured: initialData?.isFeatured ?? false,
    isActive: initialData?.isActive ?? true,
    priority: initialData?.priority ?? 0,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
    }));
  };

  const saveProject = async (imagesToSave, closeAfterSave) => {
    setError('');
    setLoadingState({ stage: 'saving', progress: null });
    try {
      let savedId = initialData?.id;
      if (initialData) {
        const body = {
          ...formData,
          priority: Number(formData.priority),
          images: imagesToSave,
          startDate: formData.startDate || null,
          budget: formData.budget || null,
        };
        const res = await fetch(`/api/projects/${initialData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          throw new Error(errBody.error || 'Failed to save project');
        }
      } else {
        const createBody = {
          ...formData,
          priority: Number(formData.priority),
          images: [],
          startDate: formData.startDate || null,
          budget: formData.budget || null,
        };
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(createBody),
        });
        if (!res.ok) throw new Error('Failed to create project');
        const project = await res.json();
        savedId = project.id;
        if (imagesToSave.length > 0) {
          const patchRes = await fetch(`/api/projects/${project.id}`, {
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
        router.push('/admin/projects');
        router.refresh();
      } else {
        setLoadingState({ stage: null, progress: null });
        if (!initialData && savedId) {
          router.replace(`/admin/projects/${savedId}/edit`);
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
    saveProject(imagesToSave, closeAfterSave);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    const imagesToSave = imagesRef.current ?? [];
    saveProject(imagesToSave, true);
  };

  return (
    <>
      <LoadingOverlay
        isVisible={loadingState.stage != null}
        stage={loadingState.stage}
        progress={loadingState.progress}
        entityLabel="project"
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
              Project Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white border border-[var(--blue-500)]/40 rounded-xl text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-[var(--blue-500)] focus:border-transparent transition-all"
              placeholder="Enter project title"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-white mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-3 bg-white border border-[var(--blue-500)]/40 rounded-xl text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-[var(--blue-500)] focus:border-transparent transition-all resize-none"
              placeholder="Enter project description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-white mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white border border-[var(--blue-500)]/40 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-[var(--blue-500)] focus:border-transparent transition-all"
              >
                <option value="MEP">MEP</option>
                <option value="Finishing">Finishing</option>
                <option value="Civil">Civil</option>
              </select>
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-semibold text-white mb-2">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white border border-[var(--blue-500)]/40 rounded-xl text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-[var(--blue-500)] focus:border-transparent transition-all"
                placeholder="e.g., Riyadh, Saudi Arabia"
              />
            </div>
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-semibold text-white mb-2">
              Slug (URL)
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-[var(--blue-500)]/40 rounded-xl text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-[var(--blue-500)] focus:border-transparent transition-all"
              placeholder="auto from title if empty"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="startDate" className="block text-sm font-semibold text-white mb-2">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-[var(--blue-500)]/40 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-[var(--blue-500)] focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label htmlFor="budget" className="block text-sm font-semibold text-white mb-2">
                Budget
              </label>
              <input
                type="text"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-[var(--blue-500)]/40 rounded-xl text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-[var(--blue-500)] focus:border-transparent transition-all"
                placeholder="e.g., 2M SAR"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="status" className="block text-sm font-semibold text-white mb-2">
                Status *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white border border-[var(--blue-500)]/40 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-[var(--blue-500)] focus:border-transparent transition-all"
              >
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="UPCOMING">Upcoming</option>
              </select>
            </div>
            {formData.status === 'COMPLETED' && (
              <div>
                <label htmlFor="completedAt" className="block text-sm font-semibold text-white mb-2">
                  Completion Date
                </label>
                <input
                  type="date"
                  id="completedAt"
                  name="completedAt"
                  value={formData.completedAt}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-[var(--blue-500)]/40 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-[var(--blue-500)] focus:border-transparent transition-all"
                />
              </div>
            )}
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
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-5 h-5 bg-white border border-[var(--blue-500)]/40 rounded text-[var(--blue-500)] focus:ring-2 focus:ring-[var(--blue-500)] focus:ring-offset-0"
              />
              <span className="text-sm font-semibold text-white">Project is active (visible on site)</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-5 h-5 bg-white border border-[var(--blue-500)]/40 rounded text-[var(--blue-500)] focus:ring-2 focus:ring-[var(--blue-500)] focus:ring-offset-0"
              />
              <span className="text-sm font-semibold text-white">Feature this project on the homepage</span>
            </label>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.push('/admin/projects')}
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
              folder="projects"
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
