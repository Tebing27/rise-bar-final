// app/admin/blogs/new/page.tsx
import { PostForm } from '@/components/admin/PostForm';

export default function NewPostPage() {
  return (
    <div className="mx-auto max-w-4xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Tambah Artikel Baru</h1>
      <div className="p-8 bg-white rounded-lg shadow">
        {/* Panggil PostForm tanpa prop 'post' */}
        <PostForm />
      </div>
    </div>
  );
}