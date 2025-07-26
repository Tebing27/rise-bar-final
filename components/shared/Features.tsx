// components/shared/Features.tsx
import { BarChart, ClipboardList, BrainCircuit } from 'lucide-react';

const features = [
  {
    name: 'Setup Profil Cepat',
    description: 'Aktifkan profil kesehatan Anda hanya dalam 30 detik. Cukup masukkan data dasar untuk memulai.',
    icon: ClipboardList,
  },
  {
    name: 'Bagikan ke Dokter Anda',
    description: 'Ekspor data dan laporan kesehatan Anda dengan mudah untuk dibagikan saat konsultasi.',
    icon: BarChart,
  },
  {
    name: 'Dapatkan Wawasan Instan',
    description: 'Lihat analisis dan tren kesehatan langsung di dashboard Anda setelah setiap pencatatan.',
    icon: BrainCircuit,
  },
];

interface FeaturesProps { 
  pilltext_features: string;
}

export function Features({pilltext_features}:FeaturesProps) {
  return (
    <section id="fitur" className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary mb-4">
             {pilltext_features}
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Tiga langkah, langsung paham kondisi Anda
            </h2>
            <p className="mt-4 text-lg leading-8 text-foreground/60">
              Persiapan simpel banget – dalam hitungan menit Anda sudah bisa mulai memantau kesehatan.
            </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-12 sm:mt-20 lg:max-w-none lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={feature.name} className="relative group">
              {/* ✅ PERBAIKAN: Lingkaran dibuat dinamis saat hover */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground font-bold text-lg z-10 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-in-out">
                {index + 1}
              </div>
              <div className="flex flex-col items-center p-8 bg-white rounded-3xl shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 mb-6">
                  <feature.icon className="h-10 w-10 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold leading-7 text-foreground">
                  {feature.name}
                </h3>
                <p className="mt-4 text-base leading-7 text-foreground/60">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}