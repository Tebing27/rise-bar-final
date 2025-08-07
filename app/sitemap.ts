import { MetadataRoute } from "next";
import { db } from "@/lib/supabase";
import { getSiteContentAsMap } from "@/lib/content";

interface Post {
  slug: string;
  created_at: string;
  image_url?: string | null;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://risebar.id";

  const siteContent = await getSiteContentAsMap();
  const heroImageUrl = siteContent.home_hero_image;

  const staticRoutes = [
    "/blog",
    "/login",
    "/register",
    "/forgot-password",
    "/tracker",
    "/tracker/new",
    "/profile",
    "/onboarding",
  ];

  const staticUrls = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  const homeUrl: MetadataRoute.Sitemap[0] = {
    url: baseUrl,
    lastModified: new Date(),
  };

  if (heroImageUrl) {
    homeUrl.images = [heroImageUrl];
  }

  const { data: posts, error } = await db
    .from("posts")
    .select("slug, created_at, image_url")
    .eq("is_published", true);

  const postUrls = posts
    ? posts.map((post: Post) => {
        const sitemapEntry: MetadataRoute.Sitemap[0] = {
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: new Date(post.created_at),
        };
        if (post.image_url) {
          sitemapEntry.images = [post.image_url];
        }
        return sitemapEntry;
      })
    : [];

  if (error) {
    console.error("Error fetching posts for sitemap:", error);
  }

  return [homeUrl, ...staticUrls, ...postUrls];
}
