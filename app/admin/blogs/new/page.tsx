// app/admin/blogs/new/page.tsx
import { PostForm } from '@/components/admin/PostForm';
import { supabaseAdmin } from '@/lib/supabase-admin';

async function getAuthors() {
  const { data: authors } = await supabaseAdmin.from('users').select('id, name');
  return authors || [];
}

export default async function NewPostPage() {
  const authors = await getAuthors(); // Panggil fungsi
  return (
    <div className="mx-auto max-w-4xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Tambah Artikel Baru</h1>
      <div className="p-8 bg-white rounded-lg shadow">
        {/* Kirim daftar penulis ke form */}
        <PostForm authors={authors} />
      </div>
    </div>
  );
}