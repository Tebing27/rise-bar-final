import { db } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image'; // Impor Image

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

export default async function BlogListPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="mx-auto max-w-4xl py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-10">Artikel Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.length > 0 ? (
          posts.map((post) => <BlogCard key={post.id} post={post} />)
        ) : (
          <p className="text-center md:col-span-2 text-gray-500">
            Belum ada artikel yang dipublikasikan.
          </p>
        )}
      </div>
    </div>
  );
}