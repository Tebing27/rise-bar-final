// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/components/providers/AuthProvider';
import { Navbar } from '@/components/shared/Navbar';
// import { Footer } from '@/components/shared/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Rise Bar | Lacak Gula Darah Anda',
  description: 'Platform cerdas untuk memantau, menganalisis, dan mengelola kadar glukosa Anda.',
  // ✅ TAMBAHKAN BARIS INI
  icons: {
    icon: '/favicon.ico', // Pastikan file favicon.ico ada di folder /app
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans flex flex-col min-h-screen`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-grow pt-8">{children}</main>
          {/* <Footer /> */}
        </AuthProvider>
      </body>
    </html>
  );
}