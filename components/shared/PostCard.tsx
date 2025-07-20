// components/blog/PostCard.tsx
import Link from 'next/link';
import Image from 'next/image';

// Tentukan tipe untuk properti post
interface Post {
  id: string;
  slug: string;
  title: string;
  image_url?: string | null;
  author_name?: string | null;
  created_at: string;
}

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <article className="flex flex-col items-start justify-between h-full bg-card rounded-lg border shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        {post.image_url && (
          <div className="relative w-full">
            <Image
              src={post.image_url}
              alt={post.title}
              width={800}
              height={400}
              className="aspect-[16/9] w-full bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
            />
            <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-gray-900/10" />
          </div>
        )}
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-center gap-x-4 text-xs">
            <time dateTime={post.created_at} className="text-foreground/60">
              {new Date(post.created_at).toLocaleDateString('id-ID', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </time>
          </div>
          <div className="group relative mt-2">
            <h3 className="text-lg font-semibold leading-6 text-foreground group-hover:text-primary">
                <span className="absolute inset-0" />
                {post.title}
            </h3>
            {/* Jika Anda punya excerpt, tampilkan di sini */}
          </div>
          {post.author_name && (
            <div className="relative mt-4 flex items-center gap-x-4">
              <div className="text-sm leading-6">
                <p className="font-semibold text-foreground">
                    Oleh <span className="absolute inset-0" />
                    {post.author_name}
                </p>
              </div>
            </div>
           )}
        </div>
      </article>
    </Link>
  );
}