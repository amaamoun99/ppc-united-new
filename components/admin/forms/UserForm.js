'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UserForm({ initialData = null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    password: '',
    role: initialData?.role || 'ADMIN',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = initialData ? `/api/users/${initialData.id}` : '/api/users';
      const method = initialData ? 'PUT' : 'POST';

      const submitData = { ...formData };
      if (initialData && !submitData.password) {
        delete submitData.password;
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error('Failed to save user');
      }

      router.push('/admin/users');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-white mb-2">
          Full Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-white border border-[var(--blue-500)]/40 rounded-xl text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-[var(--blue-500)] focus:border-transparent transition-all"
          placeholder="John Doe"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-white border border-[var(--blue-500)]/40 rounded-xl text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-[var(--blue-500)] focus:border-transparent transition-all"
          placeholder="john@ppc-united.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-white mb-2">
          Password {initialData ? '' : '*'}
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required={!initialData}
          className="w-full px-4 py-3 bg-white border border-[var(--blue-500)]/40 rounded-xl text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-[var(--blue-500)] focus:border-transparent transition-all"
          placeholder={initialData ? 'Leave blank to keep current password' : '••••••••'}
        />
        {initialData && (
          <p className="mt-1 text-xs text-white/50">
            Leave blank to keep the existing password
          </p>
        )}
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-semibold text-white mb-2">
          Role *
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-white border border-[var(--blue-500)]/40 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-[var(--blue-500)] focus:border-transparent transition-all"
        >
          <option value="ADMIN">Admin</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </select>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-3 px-6 bg-gradient-to-r from-[var(--blue-600)] to-[var(--blue-500)] hover:from-[var(--blue-500)] hover:to-[var(--blue-400)] text-white font-bold rounded-xl shadow-lg shadow-[var(--blue-500)]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : initialData ? 'Update User' : 'Create User'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/users')}
          className="px-6 py-3 bg-[var(--blue-800)]/50 hover:bg-[var(--blue-700)]/50 text-white font-semibold rounded-xl border border-[var(--blue-500)]/30 transition-all duration-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
