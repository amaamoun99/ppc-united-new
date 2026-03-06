'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || 'Failed to create account');
        return;
      }

      router.push('/login?signup=1');
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[var(--blue-950)] via-[var(--blue-900)] to-[var(--blue-800)] relative overflow-hidden">
      {/* Background Logo Watermark */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
          <Image
            src="/logo.png"
            alt=""
            fill
            className="object-contain"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </div>
      </div>

      {/* Noise Texture */}
      <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none" />

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-[var(--blue-900)]/60 backdrop-blur-xl border border-[var(--blue-500)]/20 rounded-3xl shadow-2xl shadow-[var(--blue-900)]/50 p-10">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative w-48 h-24">
              <Image
                src="/logo.png"
                alt="PPC-United"
                fill
                className="object-contain drop-shadow-xl"
                priority
              />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-[var(--blue-400)] text-sm font-medium tracking-wide">
              Register to access the admin portal
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-white mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full px-4 py-3 bg-white border border-[var(--blue-500)]/40 rounded-xl text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-[var(--blue-500)] focus:border-transparent transition-all"
                placeholder="John Doe"
                autoComplete="name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 bg-white border border-[var(--blue-500)]/40 rounded-xl text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-[var(--blue-500)] focus:border-transparent transition-all"
                placeholder="you@ppc-united.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-white mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 bg-white border border-[var(--blue-500)]/40 rounded-xl text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-[var(--blue-500)] focus:border-transparent transition-all"
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-[var(--blue-600)] to-[var(--blue-500)] hover:from-[var(--blue-500)] hover:to-[var(--blue-400)] text-white font-bold rounded-xl shadow-lg shadow-[var(--blue-500)]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>
        </div>

        <p className="text-center text-[var(--blue-400)]/80 text-xs mt-6 font-mono">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="text-[var(--blue-400)] hover:text-[var(--blue-300)] font-semibold underline underline-offset-4"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}

