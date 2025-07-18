// lib/actions/contentActions.ts
'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Skema untuk memvalidasi satu item konten
const ContentItemSchema = z.object({
  content_key: z.string(),
  content_value: z.string(),
});

// Skema untuk memvalidasi array dari item konten
const ContentSchema = z.array(ContentItemSchema);

export async function updateSiteContent(formData: FormData) {
  const formEntries = Array.from(formData.entries());

  const contentData = formEntries.map(([key, value]) => ({
    content_key: key,
    content_value: value as string,
  }));

  // Validasi semua data yang masuk
  const validatedData = ContentSchema.safeParse(contentData);

  if (!validatedData.success) {
    console.error("Validation failed:", validatedData.error);
    return { success: false, message: "Data tidak valid." };
  }

  try {
    // Gunakan 'upsert' untuk mengupdate semua data sekaligus
    const { error } = await supabaseAdmin.from('site_content').upsert(validatedData.data);
    if (error) throw new Error(error.message);
  } catch (e) {
    return { success: false, message: (e as Error).message };
  }

  // Revalidasi halaman home dan about agar menampilkan konten terbaru
  revalidatePath('/');
  revalidatePath('/about');

  return { success: true, message: "Konten berhasil diperbarui." };
}