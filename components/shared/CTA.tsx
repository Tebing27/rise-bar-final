// components/shared/CTA.tsx - Modern Call to Action
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Heart, TrendingUp } from 'lucide-react';

export function CTA() {
  return (
    <section className="section-padding bg-gradient-to-r from-primary via-primary/90 to-primary/80 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="container-modern relative">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-8 animate-scale-in">
            <Sparkles className="w-4 h-4" />
            Bergabung dengan 10,000+ Pengguna
          </div>

          {/* Main Heading */}
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            Siap untuk Memulai
            <br />
            <span className="text-white/90">Perjalanan Sehat Anda?</span>
          </h2>

          {/* Description */}
          <p className="text-xl text-white/90 leading-relaxed mb-12 max-w-2xl mx-auto animate-fade-in delay-200">
            Bergabunglah dengan ribuan pengguna yang telah merasakan manfaat mengelola kesehatan dengan lebih baik. Mulai gratis hari ini!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in delay-300">
            <Link href="/register">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4 h-auto group shadow-xl">
                Mulai Gratis Sekarang
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/blog">
              <Button variant="outline" size="lg" className="text-white border-white/30 hover:bg-white/10 text-lg px-8 py-4 h-auto">
                Pelajari Lebih Lanjut
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in delay-400">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">100% Gratis</h3>
              <p className="text-white/80 text-sm">Tidak ada biaya tersembunyi atau langganan premium</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Hasil Terbukti</h3>
              <p className="text-white/80 text-sm">95% pengguna melaporkan peningkatan kesehatan</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Setup 2 Menit</h3>
              <p className="text-white/80 text-sm">Mulai tracking kesehatan Anda dalam hitungan menit</p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-8 border-t border-white/20 animate-fade-in delay-500">
            <p className="text-white/70 text-sm mb-4">Dipercaya oleh profesional kesehatan</p>
            <div className="flex items-center justify-center gap-8 opacity-60">
              <div className="text-white/60 text-xs">⭐⭐⭐⭐⭐ 4.9/5 Rating</div>
              <div className="text-white/60 text-xs">🔒 Data Aman & Terenkripsi</div>
              <div className="text-white/60 text-xs">📱 Available di Semua Device</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}