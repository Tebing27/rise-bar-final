// lib/actions/blogActions.ts
'use server';

import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { FormState } from './trackerActions';

const PostSchema = z.object({
  id: z.string().optional(), // id opsional, ada jika sedang mengedit
  title: z.string().min(5, 'Judul minimal 5 karakter.'),
  slug: z.string().min(5, 'Slug minimal 5 karakter.'),
  content: z.string().optional(),
  is_published: z.boolean(),
});

export async function upsertPost(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = PostSchema.safeParse({
    id: formData.get('id'),
    title: formData.get('title'),
    slug: formData.get('slug'),
    content: formData.get('content'),
    // Ubah nilai checkbox menjadi boolean
    is_published: formData.get('is_published') === 'on',
  });

  if (!validatedFields.success) {
    return { success: false, errors: validatedFields.error.flatten().fieldErrors };
  }

  const { id, ...postData } = validatedFields.data;

  try {
    const { error } = await supabaseAdmin.from('posts').upsert({ id, ...postData });
    if (error) throw new Error(error.message);
  } catch (e) {
    return { success: false, message: (e as Error).message };
  }

  // Revalidasi path agar daftar artikel dan halaman blog ter-update
  revalidatePath('/admin/blogs');
  revalidatePath('/blog');
  revalidatePath(`/blog/${postData.slug}`);

  // Arahkan kembali ke halaman daftar blog admin setelah berhasil
  redirect('/admin/blogs');
}