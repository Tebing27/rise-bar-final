// app/(main)/blog/[slug]/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { notFound, usePathname } from "next/navigation";
import { calculateReadingTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Eye, Clock, UserCircle } from "lucide-react";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { db } from "@/lib/supabase";

// Tipe data untuk post
interface Post {
  id: string;
  slug: string;
  title: string;
  content: string | null;
  image_url: string | null;
  author_name: string | null;
  published_at: string;
  view_count: number;
  tags: { name: string }[];
}

export default function BlogPostPage() {
  const pathname = usePathname();
  const slug = pathname.split("/").pop();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      if (!slug) {
        setLoading(false);
        return notFound();
      }

      const { data, error } = await db
        .from("posts")
        .select(`*, tags(name)`)
        .eq("slug", slug)
        .single();

      if (error || !data) {
        setLoading(false);
        return notFound();
      }

      setPost(data as Post);
      setLoading(false);
    }
    fetchPost();
  }, [slug]);

  if (loading) {
    return <div className="text-center py-20">Memuat artikel...</div>;
  }

  if (!post) {
    return notFound();
  }

  const readingTime = calculateReadingTime(post.content || "");

  return (
    <div className="bg-background py-12 sm:py-16">
      {/* Container utama dibuat lebih fokus ke konten artikel */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Lebar artikel diatur agar nyaman dibaca */}
        <article className="mx-auto max-w-4xl">
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

          {/* Metadata Artikel */}
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              <span>Oleh {post.author_name || "Tim Rice and Care"}</span>
            </div>
            <time dateTime={post.published_at}>
              {new Date(post.published_at).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
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

          {/* ✅ PERUBAHAN: Posisi Tags dipindah ke sini */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((tag: { name: string }) => (
                <Badge key={tag.name} variant="secondary">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Konten Artikel */}
          {/* ✅ PERUBAHAN: Komponen PostContent dihapus untuk simplifikasi karena Daftar Isi sudah tidak ada */}
          <div
            className="prose prose-lg max-w-none mt-8"
            dangerouslySetInnerHTML={{ __html: post.content || "" }}
          />

          {/* ✅ PERUBAHAN: Tombol Bagikan dipindah ke sini agar responsif */}
          <div className="mt-10 pt-6 border-t">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Bagikan Artikel Ini
            </h3>
            <ShareButtons title={post.title} />
          </div>
        </article>
      </div>
    </div>
  );
}
