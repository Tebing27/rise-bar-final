// components/admin/PostForm.tsx
'use client';

import { useActionState } from 'react';
import { useState } from 'react';
import type { FormState } from '@/lib/actions/trackerActions';
import { getCloudinarySignature, upsertPost } from '@/lib/actions/blogActions';
import { PostFormButton } from './PostFormButton';
import Image from 'next/image';
import { CldUploadWidget } from 'next-cloudinary';

// Terima `post` sebagai prop, bisa null jika ini form baru
export function PostForm({ post, tags }: { post?: any | null, tags?: string }) {
  const initialState: FormState = { success: false };
  const [state, formAction] = useActionState(upsertPost, initialState);

    // State untuk menyimpan URL gambar dan status loading
    const [imageUrl, setImageUrl] = useState(post?.image_url || '');
    const [isUploading, setIsUploading] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
    
        setIsUploading(true);
    
        // 1. Dapatkan signature dari server
        const { timestamp, signature } = await getCloudinarySignature();
    
        // 2. Siapkan form data untuk dikirim ke Cloudinary
        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
        formData.append('signature', signature);
        formData.append('timestamp', timestamp.toString());
    
        // 3. Kirim langsung ke API Cloudinary
        const endpoint = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!}/image/upload`;
        
        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
        });
    
        if (response.ok) {
          const data = await response.json();
          setImageUrl(data.secure_url);
        } else {
         const errorData = await response.json();
         console.error('Upload gambar gagal, respons dari Cloudinary:', errorData);
        }
        setIsUploading(false);
      };       

  return (
    <form action={formAction} className="space-y-6">
      {/* Kirim id jika ada (untuk mode edit) */}
      {post?.id && <input type="hidden" name="id" value={post.id} />}
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Judul Artikel</label>
        <input type="text" name="title" id="title" defaultValue={post?.title} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
        {state.errors?.title && <p className="text-red-500 text-xs mt-1">{state.errors.title[0]}</p>}
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug (URL)</label>
        <input type="text" name="slug" id="slug" defaultValue={post?.slug} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
         {state.errors?.slug && <p className="text-red-500 text-xs mt-1">{state.errors.slug[0]}</p>}
      </div>
      {/* Input Gambar Menggunakan Widget */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Gambar Utama</label>
        {/* Widget Upload */}
        <CldUploadWidget
          signatureEndpoint="/api/sign-cloudinary-params" // Endpoint ini akan kita buat
          onSuccess={(result: any) => {
            setImageUrl(result.info.secure_url);
          }}
        >
          {({ open }) => {
            return (
              <button
                type="button"
                onClick={() => open()}
                className="mt-1 w-full rounded-md border-2 border-dashed border-gray-300 px-6 py-3 text-center text-sm text-gray-600 hover:border-gray-400"
              >
                Upload Gambar
              </button>
            );
          }}
        </CldUploadWidget>

        {/* Hidden input untuk menyimpan URL gambar */}
        <input type="hidden" name="image_url" value={imageUrl} />
        
        {/* Tampilkan preview gambar jika ada */}
        {imageUrl && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">Preview:</p>
            <Image src={imageUrl} alt="Preview" width={200} height={100} className="rounded-md object-cover" />
          </div>
        )}
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          Tags (pisahkan dengan koma)
        </label>
        <input 
          type="text" 
          name="tags" 
          id="tags" 
          defaultValue={tags} // Gunakan prop tags
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" 
          placeholder="contoh: diet, sehat, tips gula"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">Konten</label>
        <textarea name="content" id="content" rows={10} defaultValue={post?.content} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
      </div>

      <div className="flex items-center">
        <input id="is_published" name="is_published" type="checkbox" defaultChecked={post?.is_published} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
        <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900">Publikasikan Artikel</label>
      </div>
      
      <div className="flex items-center">
        <input id="is_popular" name="is_popular" type="checkbox" defaultChecked={post?.is_popular} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
        <label htmlFor="is_popular" className="ml-2 block text-sm text-gray-900">Tandai sebagai Artikel Populer</label>
      </div>

      <div className="flex justify-end">
        <PostFormButton isNew={!post} />
      </div>
      {state.message && <p className="text-red-500 text-sm">{state.message}</p>}
    </form>
  );
}