'use client';

import { useCallback, useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const MAX_FILE_SIZE = 1048576; // 1MB
const MAX_IMAGES = 10;

function SortableImage({ id, url, onRemove, isPrimary }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative rounded-xl overflow-hidden border-2 bg-[var(--blue-900)] border-[var(--blue-500)]/40 aspect-square ${
        isDragging ? 'z-10 opacity-80 shadow-lg' : ''
      }`}
    >
      <img
        src={url}
        alt=""
        className="w-full h-full object-cover"
      />
      {isPrimary && (
        <span className="absolute top-2 left-2 px-2 py-0.5 bg-[var(--blue-600)] text-white text-xs font-semibold rounded">
          Primary
        </span>
      )}
      <button
        type="button"
        onClick={() => onRemove(url)}
        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-600/90 hover:bg-red-500 text-white flex items-center justify-center text-sm font-bold"
        aria-label="Remove image"
      >
        ×
      </button>
      <div
        {...attributes}
        {...listeners}
        className="absolute bottom-2 left-2 right-2 py-1.5 bg-black/50 rounded text-center text-white text-xs cursor-grab active:cursor-grabbing"
      >
        Drag to reorder
      </div>
    </div>
  );
}

export default function ImageUploader({
  value = [],
  onChange,
  folder = 'projects',
  maxImages = MAX_IMAGES,
  onUploadStateChange,
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(null);

  useEffect(() => {
    if (typeof onUploadStateChange === 'function') {
      onUploadStateChange(uploading, uploadProgress);
    }
  }, [uploading, uploadProgress, onUploadStateChange]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleFileSelect = useCallback(
    async (e) => {
      const files = Array.from(e.target.files || []);
      e.target.value = '';
      if (files.length === 0) return;

      const total = value.length + files.length;
      if (total > maxImages) {
        setUploadError(`Maximum ${maxImages} images allowed. You have ${value.length}.`);
        return;
      }

      const oversized = files.filter((f) => f.size > MAX_FILE_SIZE);
      if (oversized.length > 0) {
        setUploadError(`Some files exceed 1MB limit (${oversized.map((f) => f.name).join(', ')})`);
        return;
      }

      setUploadError('');
      setUploading(true);
      const newUrls = [...value];

      try {
        for (let i = 0; i < files.length; i++) {
          setUploadProgress({ current: i + 1, total: files.length });
          const formData = new FormData();
          formData.append('file', files[i]);
          formData.append('folder', folder);
          const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || 'Upload failed');
          }
          const { url } = await res.json();
          newUrls.push(url);
          onChange(newUrls);
        }
      } catch (err) {
        setUploadError(err.message || 'Upload failed');
      } finally {
        setUploading(false);
        setUploadProgress(null);
      }
    },
    [value, maxImages, folder, onChange]
  );

  const handleRemove = useCallback(
    (url) => {
      onChange(value.filter((u) => u !== url));
    },
    [value, onChange]
  );

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const oldIndex = value.indexOf(active.id);
      const newIndex = value.indexOf(over.id);
      if (oldIndex === -1 || newIndex === -1) return;
      onChange(arrayMove(value, oldIndex, newIndex));
    },
    [value, onChange]
  );

  const ids = value.length ? value : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <label className="cursor-pointer px-4 py-2 bg-[var(--blue-600)] hover:bg-[var(--blue-500)] text-white font-semibold rounded-xl transition-colors">
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={uploading || value.length >= maxImages}
            onChange={handleFileSelect}
            className="sr-only"
          />
          {uploading ? 'Uploading...' : 'Add images'}
        </label>
        <span className="text-sm text-white/80">
          {value.length} / {maxImages} (max 1MB each)
        </span>
      </div>

      {uploadProgress && (
        <p className="text-sm text-[var(--blue-400)]">
          Uploading image {uploadProgress.current} of {uploadProgress.total}...
        </p>
      )}

      {uploadError && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {uploadError}
        </div>
      )}

      {ids.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={ids} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {value.map((url, index) => (
                <SortableImage
                  key={url}
                  id={url}
                  url={url}
                  isPrimary={index === 0}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {value.length === 0 && !uploading && (
        <div className="border-2 border-dashed border-[var(--blue-500)]/40 rounded-xl p-8 text-center text-white/60 text-sm">
          No images yet. Add images above (first image will be the primary/cover).
        </div>
      )}
    </div>
  );
}
