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
        const status = entry.status as 'Tinggi' | 'Normal' | 'Rendah';
        acc[status] = (acc[status] || 0) + 1;
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

        if (recError || !data || data.length === 0) {
            return null;
        }
        
        return data[0] as Recommendation;

    } catch (e) {
        console.error("RPC call failed:", e);
        return null;
    }
}

export async function getPersonalizedInsights(): Promise<string[]> {
  const supabase = await createClient();
  const session = await auth();
  const user = session?.user;
  if (!user) return [];

  const { data: entries } = await supabase
    .from('glucose_entries')
    .select('food_name, status')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (!entries || entries.length < 5) return [];

  const insights: string[] = [];
  const foodStatusCount: { [key: string]: { tinggi: number; total: number } } = {};

  for (const entry of entries) {
    // ✅ PERBAIKAN: Tambahkan pengecekan untuk memastikan food_name ada sebelum di-split.
    if (entry.food_name && typeof entry.food_name === 'string') {
      const foods = entry.food_name.split(',').map((f: string) => f.trim().replace(/ \(\d+x\)$/, ''));
      for (const food of foods) {
        if (!foodStatusCount[food]) {
          foodStatusCount[food] = { tinggi: 0, total: 0 };
        }
        foodStatusCount[food].total++;
        if (entry.status === 'Tinggi') {
          foodStatusCount[food].tinggi++;
        }
      }
    }
  }

  for (const food in foodStatusCount) {
    const { tinggi, total } = foodStatusCount[food];
    if (total > 3 && (tinggi / total) > 0.6) {
      insights.push(`Sepertinya, setiap Anda mengonsumsi **${food}**, kadar gula cenderung menjadi tinggi.`);
    }
  }
  
  return insights;
}
