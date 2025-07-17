// app/admin/blogs/page.tsx
import { db } from '@/lib/supabase';
import Link from 'next/link';

// Fungsi ini mengambil SEMUA post, bukan hanya yang published
async function getAllPosts() {
  const { data, error } = await db
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all posts:', error);
    return [];
  }
  return data;
}

export default async function AdminBlogsPage() {
  const posts = await getAllPosts();

  return (
    <div className="mx-auto max-w-7xl py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Kelola Blog</h1>
        <Link 
          href="/admin/blogs/new"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          + Tambah Artikel Baru
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.map((post) => (
              <tr key={post.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{post.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    post.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {post.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link href={`/admin/blogs/edit/${post.id}`} className="text-indigo-600 hover:text-indigo-900">
                    Edit
                  </Link>
                  {/* Tombol Hapus akan kita buat selanjutnya */}
                </td>
              </tr>
            ))}
             {posts.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-500">Belum ada artikel.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}