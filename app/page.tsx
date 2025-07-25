// app/page.tsx
import { getSiteContentAsMap } from '@/lib/content';
import { db } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import { Hero } from '@/components/shared/Hero';
import { Features } from '@/components/shared/Features';
import { CTA } from '@/components/shared/CTA';
import { PostCard } from '@/components/shared/PostCard';
import { Footer } from '@/components/shared/Footer';

async function getPopularPosts() {
  const { data, error } = await db
    .from('posts')
    .select('*')
    .eq('is_published', true)
    .eq('is_popular', true)
    .limit(3); // Menampilkan 3 artikel agar lebih fokus

  if (error) {
    console.error('Error fetching popular posts:', error);
    return [];
  }
  return data;
}

export default async function HomePage() {
  const [content, popularPosts] = await Promise.all([
    getSiteContentAsMap(),
    getPopularPosts()
  ]);

  return (
    <>
      <Hero
        headline={content.home_headline || 'Pantau Gula Darah, Raih Hidup Sehat.'}
        subheadline={content.home_subheadline || 'Platform cerdas untuk memantau, menganalisis, dan mengelola kadar glukosa Anda dengan lebih baik setiap hari.'}
      />
      
      <Features />

      {popularPosts.length > 0 && (
        <section id="blog" className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Wawasan Terbaru dari Blog Kami
              </h2>
              <p className="mt-4 text-lg leading-8 text-foreground/60">
                Baca artikel pilihan untuk membantu perjalanan kesehatan Anda.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
             <div className="mt-12 text-center">
               <Link href="/blog" className="text-primary hover:underline font-semibold">
                Lihat Semua Artikel &rarr;
               </Link>
             </div>
          </div>
        </section>
      )}

      <CTA />
      <Footer/>
    </>
  );
}