// components/shared/Footer.tsx
import { Instagram, Linkedin, MessageCircle } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground">Your Brand</h3>
            <p>Tagline singkat dan menarik tentang perusahaan Anda.</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground">Navigasi</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/tentang-kami" className="hover:text-primary">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/visi-misi" className="hover:text-primary">
                  Visi Misi
                </Link>
              </li>
              <li>
                <Link href="/berita" className="hover:text-primary">
                  Berita
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground">Lainnya</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/kontak-kami" className="hover:text-primary">
                  Kontak Kami
                </Link>
              </li>
              <li>
                <Link href="/testimoni" className="hover:text-primary">
                  Testimoni
                </Link>
              </li>
              {/* Tambahkan link lain jika perlu */}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground">Ikuti Kami</h3>
            <div className="flex items-center space-x-4">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <MessageCircle className="h-6 w-6" />
                <span className="sr-only">TikTok</span>
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="h-6 w-6" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p>
            &copy; {new Date().getFullYear()} Your Brand. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
