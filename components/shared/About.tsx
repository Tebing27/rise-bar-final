// ricebarfinal/components/shared/About.tsx
'use client';

import Image from 'next/image';

export function About() {
  return (
    <section id="profil" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">Tentang Glucose Tracker</h2>
          <p className="text-xl text-gray-600">Solusi Modern untuk Pemantauan Kesehatan Anda</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            {/* Ganti dengan gambar yang relevan dengan ricebarfinal jika ada */}
            <Image
              src="/images/produk.png" // Asumsi ada gambar ini di public/images
              alt="Tentang Glucose Tracker"
              width={500}
              height={400}
              className="rounded-lg shadow-xl"
            />
          </div>
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900">
              Mengapa Memilih Glucose Tracker?
            </h3>
            <p className="text-lg text-gray-700">
              Glucose Tracker adalah platform inovatif yang dirancang untuk membantu Anda memantau kadar glukosa dengan lebih efektif. Dengan teknologi modern dan antarmuka yang ramah pengguna, kami berkomitmen untuk memberikan pengalaman terbaik dalam perjalanan kesehatan Anda.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}