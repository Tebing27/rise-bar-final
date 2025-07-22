// app/(main)/blog/[slug]/page.tsx
import { db } from '@/lib/supabase';
import Image from 'next/image';
import { auth } from '@/lib/auth';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { calculateReadingTime } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Eye, Clock, UserCircle } from 'lucide-react';

// ✍️ FUNGSI UNTUK METADATA YANG LEBIH LENGKAP
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  
  const { data: post } = await db
    .from('posts')
    .select('title, content, image_url, author_name, published_at, tags(name)')
    .eq('slug', slug)
    .single();

  // Jika post tidak ada, tampilkan metadata default
  if (!post) {
    return {
      title: 'Artikel Tidak Ditemukan | GlucoseTracker',
      description: 'Sayangnya, artikel yang Anda cari tidak ada.',
      robots: 'noindex, nofollow', // Jangan index halaman 404
    };
  }

  // Buat deskripsi yang lebih optimal
  const cleanContent = post.content?.replace(/<[^>]*>/g, ''); // Hapus HTML tags
  const description = cleanContent 
    ? cleanContent.substring(0, 155).trim() + '...'
    : `Baca artikel "${post.title}" di GlucoseTracker Blog. Tips dan informasi kesehatan terpercaya.`;

  // Extract keywords dari tags
  const keywords = post.tags?.map((tag: { name: string }) => tag.name).join(', ') || '';
  
  // URL canonical
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const canonicalUrl = `${siteUrl}/blog/${slug}`;

  // Return objek metadata yang lengkap
  return {
    title: `${post.title} | GlucoseTracker Blog`,
    description: description,
    
    // Open Graph (Facebook, LinkedIn, dll)
    openGraph: {
      title: post.title,
      description: description,
      url: canonicalUrl,
      siteName: 'GlucoseTracker',
      type: 'article',
      publishedTime: post.published_at,
      authors: [post.author_name || 'GlucoseTracker Team'],
      images: post.image_url ? [
        {
          url: post.image_url,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : [],
      locale: 'id_ID',
    },
    
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: description,
      images: post.image_url ? [post.image_url] : [],
      creator: '@glucosetracker', // Ganti dengan Twitter handle Anda
    },
    
    // Meta tags tambahan
    keywords: keywords,
    authors: [{ name: post.author_name || 'GlucoseTracker Team' }],
    creator: post.author_name || 'GlucoseTracker Team',
    publisher: 'GlucoseTracker',
    
    // Canonical URL
    alternates: {
      canonical: canonicalUrl,
    },
    
    // Robot instructions
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    // Tambahan untuk artikel
    other: {
      'article:published_time': post.published_at,
      'article:author': post.author_name || 'GlucoseTracker Team',
      'article:section': 'Health & Wellness',
      'article:tag': keywords,
    },
  };
}

// 📄 KOMPONEN UNTUK MENAMPILKAN HALAMAN
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth();

  const { data: post } = await db
    .from('posts')
    .select(`*, tags(name)`)
    .eq('slug', slug)
    .single();

  if (!post) {
    notFound();
  }

  if (session?.user?.role !== 'admin') {
    await db.rpc('increment_view_count', { post_id: post.id });
  }

  const readingTime = calculateReadingTime(post.content || '');
  // Structured data untuk Google (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.content?.replace(/<[^>]*>/g, '').substring(0, 155),
    "image": post.image_url || `${process.env.NEXT_PUBLIC_SITE_URL}/default-image.png`,
    "author": {
      "@type": "Person",
      "name": post.author_name || "GlucoseTracker Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "GlucoseTracker",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`
      }
    },
    "datePublished": post.published_at,
    "dateModified": post.updated_at || post.published_at,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`
    }
  };

  // Return JSX untuk render halaman
  return (
    <>
      {/* Structured Data JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      
      <div className="bg-background py-12 sm:py-16">
        <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {post.image_url && (
            <div className="relative mb-8 w-full aspect-video rounded-xl overflow-hidden">
              <Image
                src={post.image_url}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {post.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              <span>Oleh {post.author_name || 'Tim GlucoseTracker'}</span>
            </div>
            <time dateTime={post.published_at}>
              {new Date(post.published_at).toLocaleDateString('id-ID', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </time>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{post.view_count + 1} Dilihat</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{readingTime} menit baca</span>
            </div>
          </div>

          <div
            className="prose prose-lg max-w-none mt-8"
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />

          {post.tags && post.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: { name: string }) => (
                  <Badge key={tag.name} variant="secondary">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </>
  );
}