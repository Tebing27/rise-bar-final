// components/admin/PostForm.tsx
'use client';

import { useActionState } from 'react';
import { useState } from 'react';
import { useSession } from 'next-auth/react'; // <-- 1. Impor useSession
import type { FormState } from '@/lib/actions/trackerActions';
import type { BlogFormState } from '@/lib/actions/blogActions';
import { upsertPost } from '@/lib/actions/blogActions';
import { PostFormButton } from './PostFormButton';
import Image from 'next/image';
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from 'next-cloudinary';

// Tipe Post tidak perlu diubah
interface Post {
  id?: string;
  title?: string;
  slug?: string;
  author_name?: string;
  image_url?: string;
  content?: string;
  is_published?: boolean;
  is_popular?: boolean;
}

// Hapus 'authors' dari props karena tidak lagi digunakan
export function PostForm({ post, tags }: { post?: Post | null; tags?: string; }) {
  const { data: session } = useSession(); // <-- 2. Dapatkan data sesi
  const initialState: BlogFormState = { success: false };
  const [state, formAction] = useActionState(upsertPost, initialState);
  const [imageUrl, setImageUrl] = useState(post?.image_url || '');

  // Ambil nama penulis dari sesi, berikan fallback jika tidak ada
  const authorName = session?.user?.name ?? 'Admin';

  return (
    <form action={formAction} className="space-y-6">
      {post?.id && <input type="hidden" name="id" value={post.id} />}
      
      {/* 3. Tambahkan input tersembunyi untuk nama penulis */}
      <input type="hidden" name="author_name" value={authorName} />

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
      
      {/* 4. Hapus dropdown penulis dan ganti dengan teks biasa */}
      <div>
        <span className="block text-sm font-medium text-gray-700">Nama Penulis</span>
        <p className="mt-1 text-sm text-gray-900 p-2 bg-gray-100 rounded-md">{authorName}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Gambar Utama</label>
        <CldUploadWidget
          signatureEndpoint="/api/sign-cloudinary-params"
          onSuccess={(result: CloudinaryUploadWidgetResults) => {
            if (result.info && typeof result.info === 'object' && 'secure_url' in result.info) {
              setImageUrl(result.info.secure_url);
            }
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="mt-1 w-full rounded-md border-2 border-dashed border-gray-300 px-6 py-3 text-center text-sm text-gray-600 hover:border-gray-400"
            >
              Upload Gambar
            </button>
          )}
        </CldUploadWidget>

        <input type="hidden" name="image_url" value={imageUrl} />
        
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
          defaultValue={tags} // This correctly uses the tagsString
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
        <label htmlFor="is_popular" className="ml-2 block text-sm text-gray-900">Tampilkan di Halaman Utama</label>
      </div>

      <div className="flex justify-end">
        <PostFormButton isNew={!post} />
      </div>
      {state.message && <p className="text-red-500 text-sm">{state.message}</p>}
    </form>
  );
}