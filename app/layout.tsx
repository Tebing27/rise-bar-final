// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import { getSiteContentAsMap } from "@/lib/content";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContentAsMap();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000/";

  return {
    // ✅ Menetapkan URL dasar untuk semua metadata
    metadataBase: new URL(siteUrl),

    // ✅ Menetapkan nama aplikasi secara eksplisit
    applicationName: "Rise Bar",

    title: {
      default: content.site_title || "Rise Bar – Snack Sehat dari Bahan Lokal",
      template: `%s | Rise Bar`,
    },
    description:
      content.site_description ||
      "Snack bar sehat praktis berbahan lokal: tepung kulit pisang raja, ubi ungu, dan apel Malang. Energi alami untuk gaya hidup aktif dan berkelanjutan.",

    // ✅ Menyediakan metadata Open Graph yang lebih kaya untuk media sosial & mesin pencari
    openGraph: {
      title: content.site_title || "Rise Bar – Snack Sehat dari Bahan Lokal",
      description:
        content.site_description ||
        "Snack bar sehat praktis berbahan lokal: tepung kulit pisang raja, ubi ungu, dan apel Malang. Energi alami untuk gaya hidup aktif dan berkelanjutan.",
      url: siteUrl,
      siteName: "Rise Bar – Snack Sehat dari Bahan Lokal", // ✅ Memberitahu Google nama situs Anda
      images: [
        {
          url: "/opengraph-image.png", // Gambar untuk preview saat link dibagikan
          width: 1200,
          height: 630,
        },
      ],
      locale: "id_ID",
      type: "website",
    },

    // ✅ Menyediakan ikon yang lebih lengkap untuk berbagai perangkat dan platform
    icons: {
      icon: "/favicon.ico", // Fallback utama
      shortcut: "/icon.png", // Favicon modern
      apple: "/apple-icon.png", // Untuk perangkat Apple
      other: [
        {
          rel: "android-chrome-192x192",
          url: "/android-chrome-192x192.png",
        },
        {
          rel: "android-chrome-512x512",
          url: "/android-chrome-512x512.png",
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
      <body
        className={`${inter.variable} font-sans flex flex-col min-h-screen`}
      >
        <AuthProvider>
          <main className="flex-grow">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
