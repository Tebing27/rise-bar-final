// components/admin/PostForm.tsx
'use client';

import { useActionState } from 'react';
import type { FormState } from '@/lib/actions/trackerActions';
import { upsertPost } from '@/lib/actions/blogActions';
import { PostFormButton } from './PostFormButton';

// Terima `post` sebagai prop, bisa null jika ini form baru
export function PostForm({ post }: { post?: any | null }) {
  const initialState: FormState = { success: false };
  const [state, formAction] = useActionState(upsertPost, initialState);

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
      
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">Konten</label>
        <textarea name="content" id="content" rows={10} defaultValue={post?.content} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
      </div>

      <div className="flex items-center">
        <input id="is_published" name="is_published" type="checkbox" defaultChecked={post?.is_published} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
        <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900">Publikasikan Artikel</label>
      </div>
      
      <div className="flex justify-end">
        <PostFormButton isNew={!post} />
      </div>
      {state.message && <p className="text-red-500 text-sm">{state.message}</p>}
    </form>
  );
}