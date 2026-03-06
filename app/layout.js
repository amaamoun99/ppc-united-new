import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'PPC-United | Engineering Excellence in Saudi Arabia',
  description: 'PPC-United: Leading MEP, Finishing, and Medical Projects in Saudi Arabia',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}

