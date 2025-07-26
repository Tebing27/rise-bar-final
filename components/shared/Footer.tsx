// components/shared/Footer.tsx
import { Instagram, Linkedin, MessageCircle } from 'lucide-react';
import { getSiteContentAsMap } from '@/lib/content';
import Link from 'next/link'; // <-- Tambahkan impor ini

export async function Footer() {
  const content = await getSiteContentAsMap();
  return (
    <footer className="bg-muted text-muted-foreground py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground">{content.footer_brand_name || 'Rise Bar'}</h3>
            <p>
              {content.footer_tagline || 'Solusi modern untuk pemantauan kesehatan Anda.'}
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground">Layanan</h3>
            <ul className="space-y-2">
              <li>Pemantauan Glukosa</li>
              <li>Analisis Data</li>
              <li>Artikel Kesehatan</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground">Tautan</h3>
            <ul className="space-y-2">
              {/* ✅ Perbaikan: Ganti <a> dengan <Link> untuk navigasi internal */}
              <li><Link href="/about" className="hover:text-primary">Tentang</Link></li>
              <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
              <li><Link href="/login" className="hover:text-primary">Login</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground">Ikuti Kami</h3>
            <div className="flex items-center space-x-4">
              <a href={content.social_instagram_link || '#'} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href={content.social_tiktok_link || '#'} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle className="h-6 w-6" /> 
                <span className="sr-only">TikTok</span>
              </a>
              <a href={content.social_linkedin_link || '#'} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-6 w-6" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>

        </div>
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} {content.footer_brand_name || 'Rise Bar'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}