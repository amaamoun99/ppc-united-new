import './globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'PPC-United | Engineering Excellence in Saudi Arabia',
  description: 'PPC-United: Leading MEP, Finishing, and Medical Projects in Saudi Arabia',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SmoothScrollProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}

