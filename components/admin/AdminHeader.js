'use client';

import { signOut } from 'next-auth/react';

export default function AdminHeader({ session }) {
  return (
    <header className="bg-[var(--blue-900)]/40 backdrop-blur-xl border-b border-[var(--blue-500)]/20 px-8 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Welcome back!</h2>
          <p className="text-[var(--blue-400)] text-sm">
            Manage your content and settings
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-white font-semibold">{session?.user?.name}</p>
            <p className="text-[var(--blue-400)] text-xs">
              {session?.user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="px-4 py-2 bg-[var(--blue-800)]/50 hover:bg-red-500/20 text-white hover:text-red-400 font-semibold rounded-xl border border-[var(--blue-500)]/30 hover:border-red-500/30 transition-all duration-300"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
