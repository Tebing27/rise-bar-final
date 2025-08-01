// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/components/providers/AuthProvider';
import { Navbar } from '@/components/shared/Navbar';
import { getSiteContentAsMap } from '@/lib/content';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContentAsMap();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://risebar.id';

  return {
    // ✅ Menetapkan URL dasar untuk semua metadata
    metadataBase: new URL(siteUrl),
    
    // ✅ Menetapkan nama aplikasi secara eksplisit
    applicationName: 'Rise Bar',

    title: {
      default: content.site_title || 'Rise Bar | Lacak Gula Darah Anda',
      template: `%s | Rise Bar`,
    },
    description: content.site_description || 'Platform cerdas untuk memantau, menganalisis, dan mengelola kadar glukosa Anda.',
    
    // ✅ Menyediakan metadata Open Graph yang lebih kaya untuk media sosial & mesin pencari
    openGraph: {
      title: content.site_title || 'Rise Bar | Lacak Gula Darah Anda',
      description: content.site_description || 'Platform cerdas untuk memantau, menganalisis, dan mengelola kadar glukosa Anda.',
      url: siteUrl,
      siteName: 'Rise Bar', // ✅ Memberitahu Google nama situs Anda
      images: [
        {
          url: '/opengraph-image.png', // Gambar untuk preview saat link dibagikan
          width: 1200,
          height: 630,
        },
      ],
      locale: 'id_ID',
      type: 'website',
    },

    // ✅ Menyediakan ikon yang lebih lengkap untuk berbagai perangkat dan platform
    icons: {
      icon: '/favicon.ico', // Fallback utama
      shortcut: '/icon.png', // Favicon modern
      apple: '/apple-icon.png', // Untuk perangkat Apple
      other: [
        {
          rel: 'android-chrome-192x192',
          url: '/android-chrome-192x192.png',
        },
        {
          rel: 'android-chrome-512x512',
          url: '/android-chrome-512x512.png',
        },
      ],
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${inter.variable} font-sans flex flex-col min-h-screen`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
