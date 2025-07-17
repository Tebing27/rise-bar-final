// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/components/providers/AuthProvider'; // Impor provider
import { Navbar } from '@/components/shared/Navbar';       // Impor Navbar

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Glucose Tracker',
  description: 'Track your glucose levels with ease',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider> {/* Bungkus semua dengan AuthProvider */}
          <Navbar /> {/* Tampilkan Navbar di semua halaman */}
          <main>{children}</main> {/* Konten halaman akan muncul di sini */}
        </AuthProvider>
      </body>
    </html>
  );
}