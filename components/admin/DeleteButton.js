'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteButton({ id, endpoint, itemName }) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${endpoint}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete');
      }

      router.refresh();
      setShowConfirm(false);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (showConfirm) {
    return (
      <span className="inline-flex items-center gap-2">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-red-400 hover:text-red-300 font-medium transition-colors disabled:opacity-50"
        >
          {loading ? 'Deleting...' : 'Confirm'}
        </button>
        <span className="text-white/40">|</span>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={loading}
          className="text-white/60 hover:text-white font-medium transition-colors"
        >
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="text-red-400 hover:text-red-300 font-medium transition-colors"
    >
      Delete
    </button>
  );
}
