// app/(main)/blog/[slug]/page.tsx
import { db } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Await params sebelum menggunakannya
  const { slug } = await params;
  const session = await auth();

  // 1. Ambil data post terlebih dahulu
  const { data: post, error } = await db
    .from('posts')
    .select(`*, tags(name)`)
    .eq('slug', slug)
    .single();

  if (session?.user?.role !== 'admin') {
    // Kita akan 'await' di sini untuk memastikan panggilannya selesai
    // dan bisa melihat error jika ada di log server
    const { error: rpcError } = await db.rpc('increment_view_count', { post_id: post.id });
    if (rpcError) {
      console.error('Gagal menaikkan view count:', rpcError);
    }
}
  return (
    <article className="mx-auto max-w-3xl py-12 px-4 prose lg:prose-xl">
      <h1 className="text-4xl font-extrabold tracking-tight mb-4">{post.title}</h1>

      <div className="text-gray-500 mb-8 flex items-center space-x-4">
          <span>Oleh: {post.author_name || 'Anonim'}</span>
          <span>•</span>
          <span>{new Date(post.published_at).toLocaleDateString()}</span>
          <span>•</span>
          {/* Tampilkan view_count yang sudah ada, karena penambahan terjadi di latar belakang */}
          <span>Dilihat: {post.view_count} kali</span>
      </div>

      {post.image_url && (
        <div className="my-8">
          <Image
            src={post.image_url}
            alt={post.title}
            width={800}
            height={400}
            className="rounded-lg object-cover"
            priority
          />
        </div>
      )}

      <div>{post.content}</div>
    </article>
  );
}