// app/admin/content/page.tsx
import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

async function getSiteContent() {
  const { data } = await supabaseAdmin.from('site_content').select('*');
  return data || [];
}

export default async function AdminContentPage() {
  const contents = await getSiteContent();

  // Definisikan Server Action langsung di dalam komponen
  async function updateContentAction(formData: FormData) {
    'use server';

    const formEntries = Array.from(formData.entries());

    // FILTER data untuk membuang ID internal Next.js
    const filteredEntries = formEntries.filter(([key]) => !key.startsWith('$'));
    
    // Lanjutkan dengan data yang sudah bersih
    const contentData = filteredEntries.map(([key, value]) => ({
      content_key: key,
      content_value: value as string,
    }));
    
    
    // Anda bisa menambahkan validasi Zod di sini jika perlu

    try {
        const { error } = await supabaseAdmin
        .from('site_content')
        .upsert(contentData, { onConflict: 'content_key' });
    
      if (error) throw new Error(error.message);
    } catch (e) {
      console.error("Gagal update konten:", (e as Error).message);
      // Anda bisa menangani error di sini, misalnya dengan menampilkan pesan
    }
    
    revalidatePath('/');
    revalidatePath('/about');
  }

  return (
    <div className="mx-auto max-w-4xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Kelola Konten Website</h1>

      {/* Gunakan action yang baru saja dibuat */}
      <form action={updateContentAction}>
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
          
          {contents.map((item) => (
            <div key={item.content_key}>
              <label 
                htmlFor={item.content_key} 
                className="block text-sm font-medium text-gray-700 capitalize"
              >
                {item.content_key.replace(/_/g, ' ')}
              </label>
              <textarea
                id={item.content_key}
                name={item.content_key}
                defaultValue={item.content_value || ''}
                rows={item.content_key.includes('paragraph') ? 5 : 2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
          ))}

          <div className="text-right">
            <button 
              type="submit" 
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Simpan Semua Perubahan
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}