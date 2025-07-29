// components/shared/PostCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

interface Post {
  id: string;
  slug: string;
  title: string;
  image_url?: string | null;
  author_name?: string | null;
  published_at: string;
  content?: string | null;
  tags?: { name: string }[] | null;
}

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  // Tentukan URL gambar, gunakan maskot sebagai fallback jika tidak ada image_url
  const imageUrl = post.image_url || '/mascot_berjelajah_arbie.webp'; // <-- Gambar dari folder /public

  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <article className="flex flex-col h-full bg-card rounded-xl border shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden">
        <div className="relative w-full aspect-video">
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-center gap-x-4 text-xs text-muted-foreground mb-2">
            <time dateTime={post.published_at}>
              {new Date(post.published_at).toLocaleDateString('id-ID', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </time>
          </div>
          <h3 className="text-lg font-semibold leading-6 text-foreground group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          <p className="mt-3 text-sm text-muted-foreground flex-grow">
             {post.content
              ? `${post.content.replace(/<[^>]+>/g, '').substring(0, 120)}...`
              : 'Baca lebih lanjut untuk mengetahui detailnya.'}
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
                Oleh {post.author_name || 'Tim Rise Bar'}
              </p>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}