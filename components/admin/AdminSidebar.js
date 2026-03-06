'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: '📊' },
  { label: 'Projects', href: '/admin/projects', icon: '🏗️' },
  { label: 'News', href: '/admin/news', icon: '📰' },
  { label: 'Users', href: '/admin/users', icon: '👥' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-[var(--blue-900)]/60 backdrop-blur-xl border-r border-[var(--blue-500)]/20 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[var(--blue-500)]/20">
        <Link href="/admin" className="flex items-center justify-center">
          <div className="relative w-40 h-16">
            <Image
              src="/logo.png"
              alt="PPC-United"
              fill
              className="object-contain drop-shadow-xl"
              priority
            />
          </div>
        </Link>
        <p className="text-center text-[var(--blue-400)] text-xs font-semibold mt-2 tracking-wide">
          Admin Panel
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
              isActive(item.href)
                ? 'bg-gradient-to-r from-[var(--blue-600)] to-[var(--blue-500)] text-white shadow-lg shadow-[var(--blue-500)]/30'
                : 'text-white/70 hover:text-white hover:bg-[var(--blue-800)]/50'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[var(--blue-500)]/20">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-4 py-3 text-[var(--blue-400)] hover:text-white text-sm font-semibold transition-colors"
        >
          <span>←</span>
          <span>Back to Website</span>
        </Link>
      </div>
    </aside>
  );
}
