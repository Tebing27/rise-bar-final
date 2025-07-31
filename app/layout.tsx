// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/components/providers/AuthProvider';
import { Navbar } from '@/components/shared/Navbar';
// import { Footer } from '@/components/shared/Footer';
import { getSiteContentAsMap } from '@/lib/content';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContentAsMap();

  return {
    title: content.site_title || 'Rise Bar | Lacak Gula Darah Anda',
    description: content.site_description || 'Platform cerdas untuk memantau, menganalisis, dan mengelola kadar glukosa Anda.',
    icons: {
      icon: content.site_favicon_url || '/favicon.ico',
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
      <meta name="google-site-verification" content="9AEwNOv_oJ_CoM5uxOe-T5pVuNHVyIXtp-cjMCRHLzo" />
      </head>
      <body className={`${inter.variable} font-sans flex flex-col min-h-screen`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          {/* <Footer /> */}
        </AuthProvider>
      </body>
    </html>
  );
}
