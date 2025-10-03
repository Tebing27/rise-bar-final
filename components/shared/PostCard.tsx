// components/shared/PostCard.tsx
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface Post {
  id: string;
  slug: string;
  title: string;
  external_url?: string | null; // <-- URL eksternal
  image_url?: string | null;
  author_name?: string | null;
  published_at: string;
  content?: string | null; // <-- Ini sekarang excerpt
  tags?: { name: string }[] | null;
}

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const imageUrl = post.image_url || "/mascot_berjelajah_arbie.webp";
  // Tentukan link tujuan: jika ada external_url, gunakan itu. Jika tidak, fallback ke halaman slug.
  const href = post.external_url || `/blog/${post.slug}`;

  return (
    <a
      href={href}
      target="_blank" // Buka di tab baru
      rel="noopener noreferrer" // Keamanan untuk link eksternal
      className="block group"
    >
      <article className="flex flex-col h-full bg-card rounded-xl border shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden">
        <div className="relative w-full aspect-video">
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-center gap-x-4 text-xs text-muted-foreground mb-2">
            <time dateTime={post.published_at}>
              {new Date(post.published_at).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
          <h3 className="text-lg font-semibold leading-6 text-foreground group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          {/* Tampilkan deskripsi singkat (excerpt) dari 'content' */}
          <p className="mt-3 text-sm text-muted-foreground flex-grow">
            {post.content || "Baca lebih lanjut untuk mengetahui detailnya..."}
          </p>
          {post.tags && post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag.name} variant="secondary">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
          <div className="relative mt-6 flex items-center gap-x-4">
            <div className="text-sm leading-6">
              <p className="font-semibold text-foreground">
                Oleh {post.author_name || "Tim Rise Bar"}
              </p>
            </div>
          </div>
        </div>
      </article>
    </a>
  );
}
