// app/(main)/blog/[slug]/page.tsx
import { db } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Image from 'next/image'; // Impor komponen Image

async function getPostBySlug(slug: string) {
  const { data, error } = await db
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    notFound();
  }
  
  return data;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  // Await params sebelum menggunakannya
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  return (
    <article className="mx-auto max-w-3xl py-12 px-4 prose lg:prose-xl">
      <h1 className="text-4xl font-extrabold tracking-tight mb-4">{post.title}</h1>

      {/* Tambahkan Tampilan Gambar Utama di sini */}
      {post.image_url && (
        <div className="my-8">
          <Image
            src={post.image_url}
            alt={post.title}
            width={800}
            height={400}
            className="rounded-lg object-cover"
            priority // Tambahkan priority agar gambar utama dimuat lebih cepat
          />
        </div>
      )}

      {post.published_at && (
         <p className="text-gray-500 mb-8">
            Dipublikasikan pada: {new Date(post.published_at).toLocaleDateString()}
         </p>
      )}

      {/* Konten blog */}
      <div>{post.content}</div>
    </article>
  );
}