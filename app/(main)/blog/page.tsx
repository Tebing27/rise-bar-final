// app/(main)/blog/page.tsx
import { db } from '@/lib/supabase';
import Link from 'next/link';

// Komponen Card untuk menampilkan satu artikel blog
function BlogCard({ post }: { post: any }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
    >
      <h3 className="text-2xl font-bold mb-2 text-gray-800">{post.title}</h3>
      <p className="text-gray-600 mb-4">
        {/* Tampilkan cuplikan konten jika ada, jika tidak, tampilkan placeholder */}
        {post.content
          ? `${post.content.substring(0, 150)}...`
          : 'Klik untuk membaca lebih lanjut.'}
      </p>
      <span className="font-semibold text-indigo-600">Baca Selengkapnya →</span>
    </Link>
  );
}

// Fungsi untuk mengambil data blog dari database
async function getPublishedPosts() {
  const { data, error } = await db
    .from('posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
  return data;
}

export default async function BlogListPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="mx-auto max-w-4xl py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-10">Artikel Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.length > 0 ? (
          posts.map((post) => <BlogCard key={post.id} post={post} />)
        ) : (
          <p className="text-center md:col-span-2 text-gray-500">
            Belum ada artikel yang dipublikasikan.
          </p>
        )}
      </div>
    </div>
  );
}