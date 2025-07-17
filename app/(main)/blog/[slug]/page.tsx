// app/(main)/blog/[slug]/page.tsx
import { db } from '@/lib/supabase';
import { notFound } from 'next/navigation';

// Fungsi untuk mengambil satu post berdasarkan slug
async function getPost(slug: string) {
  const { data, error } = await db
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single(); // .single() akan error jika tidak ada data, bagus untuk notFound()

  if (error || !data) {
    notFound(); // Jika post tidak ditemukan, tampilkan halaman 404
  }
  return data;
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);

  return (
    <article className="mx-auto max-w-3xl py-12 px-4 prose lg:prose-xl">
      <h1 className="text-4xl font-extrabold tracking-tight mb-4">{post.title}</h1>
      {post.published_at && (
         <p className="text-gray-500 mb-8">
            Dipublikasikan pada: {new Date(post.published_at).toLocaleDateString()}
         </p>
      )}
      
      {/* Di sini konten blog akan ditampilkan */}
      <div>{post.content}</div>
    </article>
  );
}