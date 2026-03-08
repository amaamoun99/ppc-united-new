'use client';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/admin');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
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
      <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none"></div>

      {/* Login Card */}
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

          {/* Blue Glow Effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-[var(--blue-500)]/20 via-[var(--blue-400)]/10 to-[var(--blue-500)]/20 blur-[80px] rounded-full -z-10" />

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-[var(--blue-400)] text-sm font-medium tracking-wide">
              Sign in to manage your content
            </p>
          </div>

          {/* Success / Error Messages */}
          {searchParams.get('signup') === '1' && !error && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/40 rounded-xl text-emerald-300 text-sm">
              Account created successfully. You can now sign in.
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="admin@ppc-united.com"
                autoComplete="username"
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
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-[var(--blue-600)] to-[var(--blue-500)] hover:from-[var(--blue-500)] hover:to-[var(--blue-400)] text-white font-bold rounded-xl shadow-lg shadow-[var(--blue-500)]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Signup link */}
          <p className="mt-6 text-center text-[var(--blue-400)]/80 text-xs font-mono">
            Do not have an account yet?{' '}
            <Link
              href="/signup"
              className="text-[var(--blue-400)] hover:text-[var(--blue-300)] font-semibold underline underline-offset-4"
            >
              Sign up
            </Link>
          </p>

          {/* Decorative Line */}
          <div className="mt-8 flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-[var(--blue-500)] via-[var(--blue-600)] to-[var(--blue-500)] shadow-[0_0_20px_rgba(0,168,255,0.4)]" />
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-[var(--blue-400)]/60 text-xs mt-6 font-mono">
          PPC United © 2026 • Engineering Excellence
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[var(--blue-950)] via-[var(--blue-900)] to-[var(--blue-800)]">
        <div className="text-white/60">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
