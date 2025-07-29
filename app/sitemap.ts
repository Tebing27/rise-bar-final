import { MetadataRoute } from 'next';
import { db } from '@/lib/supabase';
import { getSiteContentAsMap } from '@/lib/content'; // Import fungsi untuk mengambil konten

interface Post {
  slug: string;
  created_at: string;
  image_url?: string | null;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Ambil konten situs (termasuk URL gambar hero)
  const siteContent = await getSiteContentAsMap();
  const heroImageUrl = siteContent.home_hero_image;

  // 1. Halaman Statis
  const staticRoutes = [
    '/blog',
    '/login',
    '/register',
    '/forgot-password',
    '/tracker',
    '/tracker/new',
    '/profile',
    '/onboarding',
  ];

  const staticUrls = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  // Buat entri khusus untuk Halaman Beranda dengan gambarnya
  const homeUrl: MetadataRoute.Sitemap[0] = {
    url: baseUrl,
    lastModified: new Date(),
  };

  if (heroImageUrl) {
    homeUrl.images = [heroImageUrl];
  }

  // 2. Halaman Blog Dinamis
  const { data: posts, error } = await db
    .from('posts')
    .select('slug, created_at, image_url')
    .eq('is_published', true);
  
  const postUrls = posts ? posts.map((post: Post) => {
    const sitemapEntry: MetadataRoute.Sitemap[0] = {
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.created_at),
    };
    if (post.image_url) {
      sitemapEntry.images = [post.image_url];
    }
    return sitemapEntry;
  }) : [];
  
  if (error) {
    console.error('Error fetching posts for sitemap:', error);
  }

  // 3. Gabungkan semua URL
  return [homeUrl, ...staticUrls, ...postUrls];
}