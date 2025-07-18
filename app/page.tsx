// app/page.tsx
import { getSiteContentAsMap } from '@/lib/content';

export default async function HomePage() {
  const content = await getSiteContentAsMap();

  return (
    <div className="flex items-center justify-center min-h-screen text-center px-4">
      <main className="max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-gray-900">
          {content.home_headline || 'Judul Belum Diatur'}
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          {content.home_subheadline || 'Sub-judul belum diatur.'}
        </p>
        {/* Anda bisa menambahkan tombol atau elemen lain di sini */}
      </main>
    </div>
  );
}