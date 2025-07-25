// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/components/providers/AuthProvider';
import { Navbar } from '@/components/shared/Navbar';
// import { Footer } from '@/components/shared/Footer';

// Inisialisasi font Inter
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'GlucoseTracker | Lacak Gula Darah Anda',
  description: 'Platform cerdas untuk memantau, menganalisis, dan mengelola kadar glukosa Anda.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Terapkan variabel font di sini */}
      <body className={`${inter.variable} font-sans flex flex-col min-h-screen`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-grow pt-6">{children}</main>
          {/* <Footer /> */}
        </AuthProvider>
      </body>
    </html>
  );
}