// app/(main)/blog/[slug]/page.tsx
import { db } from '@/lib/supabase';
import Image from 'next/image';
import { auth } from '@/lib/auth';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { calculateReadingTime } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Eye, Clock, UserCircle } from 'lucide-react';

// ✅ PERBAIKAN UNTUK NEXT.JS 15: `params` sekarang adalah Promise yang harus di-await
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; // Await the params Promise
  
  const { data: post } = await db
    .from('posts')
    .select('title, content, image_url, author_name, published_at, tags(name)')
    .eq('slug', slug)
    .single();

  // ... (rest of the function is correct)
  if (!post) {
    return {
      title: 'Artikel Tidak Ditemukan | GlucoseTracker',
      description: 'Sayangnya, artikel yang Anda cari tidak ada.',
      robots: 'noindex, nofollow',
    };
  }
  const cleanContent = post.content?.replace(/<[^>]*>/g, '');
  const description = cleanContent 
    ? cleanContent.substring(0, 155).trim() + '...'
    : `Baca artikel "${post.title}" di GlucoseTracker Blog. Tips dan informasi kesehatan terpercaya.`;
  const keywords = post.tags?.map((tag: { name: string }) => tag.name).join(', ') || '';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const canonicalUrl = `${siteUrl}/blog/${slug}`;
  return {
    title: `${post.title} | GlucoseTracker Blog`,
    description: description,
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
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: description,
      images: post.image_url ? [post.image_url] : [],
      creator: '@glucosetracker',
    },
    keywords: keywords,
    authors: [{ name: post.author_name || 'GlucoseTracker Team' }],
    creator: post.author_name || 'GlucoseTracker Team',
    publisher: 'GlucoseTracker',
    alternates: {
      canonical: canonicalUrl,
    },
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
    other: {
      'article:published_time': post.published_at,
      'article:author': post.author_name || 'GlucoseTracker Team',
      'article:section': 'Health & Wellness',
      'article:tag': keywords,
    },
  };
}

// ✅ PERBAIKAN UNTUK NEXT.JS 15: Page component juga harus await params
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; // Await the params Promise
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
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.content?.replace(/<[^>]*>/g, '').substring(0, 155),
    "image": post.image_url || `${process.env.NEXT_PUBLIC_SITE_URL}/mascot_bertanya.webp`,
    "author": {
      "@type": "Person",
      "name": post.author_name || "GlucoseTracker Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "GlucoseTracker",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_SITE_URL}/logo.webp`
      }
    },
    "datePublished": post.published_at,
    "dateModified": post.updated_at || post.published_at,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`
    }
  };

  return (
    <>
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