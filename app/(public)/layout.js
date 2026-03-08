'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';

export default function PublicLayout({ children }) {
  const pathname = usePathname();
  return (
    <SmoothScrollProvider>
      <Header />
      <main>{children}</main>
      <Footer key={pathname} />
    </SmoothScrollProvider>
  );
}
