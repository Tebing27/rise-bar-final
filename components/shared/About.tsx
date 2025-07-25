// components/shared/About.tsx
import Image from 'next/image';
import { Users, Smile } from 'lucide-react';

export function About() {
  return (
    <section id="about" className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Judul Section */}
        <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary mb-4">
             👋 Halo, Rise!
            </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Tentang Rise Bar
          </h2>
          <p className="mt-4 text-lg leading-8 text-foreground/60">
            Solusi Modern untuk Pemantauan Kesehatan Anda
          </p>
        </div>

        {/* Konten Dua Kolom */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Kolom Gambar */}
          <div className="flex justify-center animate-in fade-in zoom-in-95 duration-700">
            <Image
              src="/risebar_hero.png" // Menggunakan gambar yang sudah ada
              alt="Tentang Glucose Tracker"
              width={500}
              height={500}
              className="rounded-lg"
            />
          </div>

          {/* Kolom Teks dan Statistik */}
          <div className="animate-in fade-in slide-in-from-right-8 duration-700">
            <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Mengapa Memilih Rise Bar?
            </h3>
            <p className="mt-6 text-lg leading-8 text-foreground/70">
              Rise Bar adalah platform inovatif yang dirancang khusus untuk membantu Anda mengelola dan memantau kadar gula darah dengan lebih efektif. Dengan teknologi modern dan antarmuka yang user-friendly, kami berkomitmen untuk memberikan pengalaman terbaik dalam perjalanan kesehatan Anda.
            </p>
            
            {/* Statistik */}
            <div className="mt-10 flex gap-x-12 gap-y-8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">1000+</p>
                  <p className="text-base text-muted-foreground">Pengguna Aktif</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Smile className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">98%</p>
                  <p className="text-base text-muted-foreground">Tingkat Kepuasan</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}