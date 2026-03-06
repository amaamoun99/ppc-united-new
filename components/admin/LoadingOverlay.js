'use client';

export default function LoadingOverlay({ isVisible, stage, progress = null, entityLabel = 'project' }) {
  if (!isVisible || !stage) return null;

  const messages = {
    saving: `Saving ${entityLabel} details...`,
    uploading: progress
      ? `Uploading images (${progress.current}/${progress.total})...`
      : 'Uploading images...',
    finalizing: 'Finalizing...',
  };

  const message = messages[stage] || 'Please wait...';

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="bg-[var(--blue-900)]/90 backdrop-blur-xl border border-[var(--blue-500)]/30 rounded-2xl p-8 shadow-2xl min-w-[280px]">
        <div className="flex flex-col items-center gap-6">
          <div
            className="w-12 h-12 border-3 border-[var(--blue-500)]/30 border-t-[var(--blue-400)] rounded-full animate-spin"
            style={{ borderWidth: 3 }}
            role="status"
            aria-label="Loading"
          />
          <p className="text-white font-semibold text-center">{message}</p>
          {progress && progress.total > 1 && (
            <div className="w-full max-w-[200px] h-1.5 bg-[var(--blue-800)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--blue-500)] transition-all duration-300"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
