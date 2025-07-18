'use server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { FormState } from './trackerActions';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PostSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5, { message: 'Judul minimal 5 karakter.' }),
  // Tambahkan author_name ke skema
  author_name: z.string().min(3, { message: 'Nama penulis minimal 3 karakter.' }),
  slug: z.string().min(5, { message: 'Slug minimal 5 karakter.' }),
  content: z.string().optional(),
  image_url: z.string().optional(),
  is_published: z.boolean(),
  is_popular: z.boolean(),
  tags: z.string().optional(),
});

async function handleTags(post_id: string, tagsString?: string | null) {
  await supabaseAdmin.from('post_tags').delete().eq('post_id', post_id);

  if (!tagsString) return;

  const tagNames = tagsString.split(',').map(tag => tag.trim().toLowerCase()).filter(Boolean);
  if (tagNames.length === 0) return;
  
  const { data: existingTags } = await supabaseAdmin.from('tags').select('id, name').in('name', tagNames);
  const existingTagNames = existingTags?.map(t => t.name) || [];

  const newTagNames = tagNames.filter(name => !existingTagNames.includes(name));
  let newTags: any[] = [];

  if (newTagNames.length > 0) {
    const { data } = await supabaseAdmin.from('tags').insert(newTagNames.map(name => ({ name }))).select();
    newTags = data || [];
  }

  const allTagIds = [...(existingTags || []), ...newTags].map(t => t.id);

  await supabaseAdmin.from('post_tags').insert(allTagIds.map(tag_id => ({ post_id, tag_id })));
}

export async function upsertPost(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {

  const rawData = {
    id: formData.get('id') || undefined,
    title: formData.get('title'),
    author_name: formData.get('author_name'),
    slug: formData.get('slug'),
    content: formData.get('content'),
    image_url: formData.get('image_url'),
    is_published: formData.get('is_published') === 'on',
    is_popular: formData.get('is_popular') === 'on',
    tags: formData.get('tags'),
  };

  const validatedFields = PostSchema.safeParse(rawData);
  if (!validatedFields.success) {
    return { success: false, errors: validatedFields.error.flatten().fieldErrors };
  }

  const { id, tags, ...postData } = validatedFields.data;

  // Perbaikan di sini: Pastikan dataToUpsert berisi semua data dari postData
  const dataToUpsert = {
      ...postData,
      published_at: postData.is_published && !id ? new Date().toISOString() : undefined,
  };

  try {
    const { data: upsertedPost, error } = await supabaseAdmin
      .from('posts')
      .upsert({ id, ...dataToUpsert }) // Gunakan dataToUpsert
      .select('id')
      .single();
      
    if (error) throw new Error(error.message);
    if (!upsertedPost) throw new Error("Gagal mendapatkan ID post setelah upsert.");

    await handleTags(upsertedPost.id, tags);

  } catch (e) {
    return { success: false, message: (e as Error).message };
  }

  revalidatePath('/admin/blogs');
  revalidatePath('/blog');
  revalidatePath(`/blog/${postData.slug}`);
  redirect('/admin/blogs');
}

export async function getCloudinarySignature() {
  const timestamp = Math.round(new Date().getTime() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
    },
    process.env.CLOUDINARY_API_SECRET!
  );

  return { timestamp, signature };
}

export async function deletePost(postId: string) {
    if (!postId) {
      return { success: false, message: 'ID Post tidak valid.' };
    }
  
    try {
      // Hapus relasi di post_tags terlebih dahulu (jika ada)
      await supabaseAdmin.from('post_tags').delete().eq('post_id', postId);
  
      // Hapus gambar dari Cloudinary jika ada (opsional tapi direkomendasikan)
      const { data: post } = await supabaseAdmin.from('posts').select('image_url').eq('id', postId).single();
      if (post?.image_url) {
        const publicId = post.image_url.split('/').pop()?.split('.')[0];
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }
      
      // Hapus post dari database
      const { error } = await supabaseAdmin.from('posts').delete().eq('id', postId);
  
      if (error) {
        throw new Error(error.message);
      }
  
      // Revalidasi path agar daftar artikel ter-update
      revalidatePath('/admin/blogs');
      revalidatePath('/blog');
      
      return { success: true, message: 'Artikel berhasil dihapus.' };
  
    } catch (e) {
      const error = e as Error;
      return { success: false, message: error.message };
    }
  }