// app/(main)/blog/page.tsx
import { getPosts, getAllTags } from '@/lib/actions/blogActions';
import { SearchAndFilter } from '@/components/blog/SearchAndFilter';
import { PostCard } from '@/components/shared/PostCard';
import { Pagination } from '@/components/admin/Pagination';

// Interface ini sudah benar
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

// Fungsi `BlogCard` dan `getPublishedPosts` yang tidak terpakai sudah dihapus

export default async function BlogListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const { search, sortBy, page, tag } = resolvedSearchParams;

  const [{ posts, totalPages }, tags] = await Promise.all([
    getPosts({
      search: search as string,
      sortBy: sortBy as string,
      page: page ? parseInt(page as string) : 1,
      tag: tag as string,
    }),
    getAllTags(),
  ]);

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Wawasan Kesehatan
            </h1>
            <p className="mt-4 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
                Temukan artikel, tips, dan panduan terbaru untuk membantu Anda mengelola kesehatan.
            </p>
        </div>

        <div className="max-w-3xl mx-auto">
            <SearchAndFilter tags={tags} />
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts && posts.length > 0 ? (
            // ✅ Perbaikan: Berikan tipe 'Post' pada parameter 'post'
            posts.map((post: Post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="md:col-span-2 lg:col-span-3 text-center py-16">
              <h3 className="text-xl font-semibold">Artikel Tidak Ditemukan</h3>
              <p className="text-muted-foreground mt-2">
                Coba gunakan kata kunci atau filter yang lain.
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