// app/page.tsx
import { getSiteContentAsMap } from '@/lib/content';
import { db } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

// Fungsi untuk mengambil post populer
async function getPopularPosts() {
  const { data, error } = await db
    .from('posts')
    .select('*')
    .eq('is_published', true)
    .eq('is_popular', true) // Filter hanya yang populer
    .limit(4); // Batasi hanya 4 artikel

  if (error) {
    console.error('Error fetching popular posts:', error);
    return [];
  }
  return data;
}

export default async function HomePage() {
  // Ambil kedua data secara paralel untuk efisiensi
  const [content, popularPosts] = await Promise.all([
    getSiteContentAsMap(),
    getPopularPosts()
  ]);

  return (
    <>
      {/* Bagian Hero Section */}
      <div className="flex items-center justify-center min-h-[70vh] text-center px-4">
        <main className="max-w-2xl">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-gray-900">
            {content.home_headline || 'Judul Belum Diatur'}
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            {content.home_subheadline || 'Sub-judul belum diatur.'}
          </p>
        </main>
      </div>

      {/* Bagian Blog Populer BARU */}
      {popularPosts.length > 0 && (
        <div className="bg-gray-50 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-8">Artikel Populer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {popularPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="block group">
                  <div className="overflow-hidden rounded-lg shadow-md group-hover:shadow-xl transition-shadow">
                    {post.image_url && (
                      <Image
                        src={post.image_url}
                        alt={post.title}
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4 bg-white">
                      <h3 className="font-semibold text-lg truncate">{post.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">Oleh {post.author_name}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}