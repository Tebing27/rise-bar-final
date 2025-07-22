// lib/actions/recommendationActions.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { auth } from '@/lib/auth';

export interface Recommendation {
  id: string;
  created_at: string;
  title: string;
  description: string;
  category: string;
}

const RecommendationSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5, { message: "Judul minimal 5 karakter." }),
  description: z.string().min(10, { message: "Deskripsi minimal 10 karakter." }),
  category: z.enum(['Tinggi', 'Normal', 'Rendah'], { message: "Kategori harus dipilih." }),
});

export async function getRecommendations() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('recommendations').select('*').order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
  return data;
}

export async function upsertRecommendation(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const validatedFields = RecommendationSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }
  
  const { id, ...dataToUpsert } = validatedFields.data;

  const query = id 
    ? supabase.from('recommendations').update(dataToUpsert).eq('id', id)
    : supabase.from('recommendations').insert(dataToUpsert);
  
  const { error } = await query;

  if (error) {
    console.error("Upsert recommendation error:", error);
    return { error: 'Gagal menyimpan rekomendasi.' };
  }
  
  revalidatePath('/admin/recommendations');
  revalidatePath('/tracker');
  return { success: 'Rekomendasi berhasil disimpan.' };
}

export async function deleteRecommendation(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('recommendations').delete().eq('id', id);

  if (error) {
    console.error("Delete recommendation error:", error);
    return { error: 'Gagal menghapus rekomendasi.' };
  }

  revalidatePath('/admin/recommendations');
  revalidatePath('/tracker');
  return { success: 'Rekomendasi berhasil dihapus.' };
}

export async function getAnalysisRecommendation(): Promise<Recommendation | null> {
    const supabase = await createClient();
    const session = await auth();
    const user = session?.user;

    if (!user) return null;

    const { data: allEntries, error: entryError } = await supabase
        .from('glucose_entries')
        .select('status')
        .eq('user_id', user.id);
    
    if (entryError || !allEntries || allEntries.length === 0) {
        return null;
    }

    const statusCounts = allEntries.reduce((acc, entry) => {
        acc[entry.status] = (acc[entry.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    let dominantStatus = 'Normal';
    let maxCount = 0;
    for (const status in statusCounts) {
        if (statusCounts[status] > maxCount) {
            maxCount = statusCounts[status];
            dominantStatus = status;
        }
    }

    try {
        const { data, error: recError } = await supabase
            .rpc('get_random_recommendation', { p_category: dominantStatus });

        // --- PERBAIKAN DI SINI ---
        // Cek jika terjadi error atau jika data yang dikembalikan kosong/tidak valid
        if (recError || !data || data.length === 0) {
            return null;
        }
        
        // Kembalikan item pertama dari array yang dihasilkan oleh RPC
        return data[0] as Recommendation;
        // --- AKHIR PERBAIKAN ---

    } catch (e) {
        console.error("RPC call failed:", e);
        return null;
    }
}