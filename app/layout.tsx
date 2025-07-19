// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/components/providers/AuthProvider';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer'; // <-- Impor Footer

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
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <AuthProvider>
          <Navbar />
          {/* Tambahkan flex-grow agar konten mengisi ruang */}
          <main className="flex-grow">{children}</main>
          <Footer /> {/* <-- Tambahkan Footer di sini */}
        </AuthProvider>
      </body>
    </html>
  );
}