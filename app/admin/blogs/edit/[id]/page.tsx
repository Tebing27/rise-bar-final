// app/admin/blogs/edit/[id]/page.tsx
import { PostForm } from '@/components/admin/PostForm';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { notFound } from 'next/navigation';

async function getPostById(id: string) {
  const { data, error } = await supabaseAdmin.from('posts').select('*').eq('id', id).single();
  if (error) notFound();
  return data;
}

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  // Await params sebelum menggunakannya
  const { id } = await params;
  const post = await getPostById(id);

  return (
    <div className="mx-auto max-w-4xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Edit Artikel</h1>
       <div className="p-8 bg-white rounded-lg shadow">
         {/* Panggil PostForm dengan prop 'post' yang sudah ada */}
        <PostForm post={post} />
      </div>
    </div>
  );
}