import { db } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image'; // Impor Image
import { getPosts } from '@/lib/actions/blogActions';
import { SearchAndFilter } from '@/components/blog/SearchAndFilter';
import { PostCard } from '@/components/shared/PostCard'; // Assuming BlogCard is in shared
import { Pagination } from '@/components/admin/Pagination'; // We can reuse the admin pagination

interface Tag {
  name: string;
}

interface Post {
  id: string;
  slug: string;
  title: string;
  image_url?: string;
  author_name?: string;
  published_at: string;
  content?: string;
  tags: Tag[];
}

function BlogCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden"
    >
      {post.image_url && (
        <Image 
          src={post.image_url} 
          alt={post.title}
          width={400}
          height={200}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-2">
            {/* Ganti post.author?.name menjadi post.author_name */}
            <span>Oleh: {post.author_name || 'RiceBar'}</span>
            <span className="mx-2">•</span>
            <span>{new Date(post.published_at).toLocaleDateString()}</span>
        </div>
        <h3 className="text-2xl font-bold mb-2 text-gray-800">{post.title}</h3>
        {/* Tampilkan Tags di sini */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags?.map((tag: Tag) => (
            <span key={tag.name} className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {tag.name}
            </span>
          ))}
        </div>
        <p className="text-gray-600 mb-4">
          {post.content ? `${post.content.substring(0, 100)}...` : 'Klik untuk membaca lebih lanjut.'}
        </p>
        <span className="font-semibold text-indigo-600">Baca Selengkapnya →</span>
      </div>
    </Link>
  );
}

// Fungsi untuk mengambil data blog dari database
async function getPublishedPosts() {
  const { data, error } = await db
    .from('posts')
    // Ambil juga nama penulis dan nama tag
    .select(`
      *,
      author:users ( name ),
      tags ( name )
    `)
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
  return data;
}

export default async function BlogListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  // This is the correct way to access searchParams in a Server Component
  const resolvedSearchParams = await searchParams;
  const { search, sortBy, page } = resolvedSearchParams;

  const { posts, totalPages } = await getPosts({
    search,
    sortBy,
    page: page ? parseInt(page) : 1,
  });

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Wawasan Kesehatan
            </h1>
            <p className="mt-4 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
                Temukan artikel, tips, dan panduan terbaru dari para ahli untuk membantu Anda mengelola kesehatan glukosa dengan lebih baik.
            </p>
        </div>

        <div className="max-w-3xl mx-auto">
            <SearchAndFilter />
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts && posts.length > 0 ? (
            posts.map((post: any) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="md:col-span-2 lg:col-span-3 text-center py-16">
              <h3 className="text-xl font-semibold">Artikel Tidak Ditemukan</h3>
              <p className="text-muted-foreground mt-2">
                Coba gunakan kata kunci lain atau sesuaikan filter Anda.
              </p>
            </div>
          )}
        </div>

        <div className="mt-16 flex justify-center">
          {totalPages > 1 && <Pagination totalPages={totalPages} />}
        </div>
      </div>
    </div>
  );
}