// lib/actions/recommendationActions.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
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

// Fungsi getRecommendations, upsertRecommendation, dan deleteRecommendation tidak perlu diubah
export async function getRecommendations() {
  const { data, error } = await supabaseAdmin.from('recommendations').select('*').order('created_at', { ascending: false });
  if (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
  return data;
}

export async function upsertRecommendation(prevState: any, formData: FormData) {
  const validatedFields = RecommendationSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }
  const { error } = await supabaseAdmin.from('recommendations').upsert(validatedFields.data);
  if (error) {
    console.error("Upsert recommendation error:", error);
    return { error: 'Gagal menyimpan rekomendasi.' };
  }
  revalidatePath('/admin/recommendations');
  revalidatePath('/tracker');
  return { success: 'Rekomendasi berhasil disimpan.' };
}

export async function deleteRecommendation(id: string) {
  const { error } = await supabaseAdmin.from('recommendations').delete().eq('id', id);
  if (error) {
    console.error("Delete recommendation error:", error);
    return { error: 'Gagal menghapus rekomendasi.' };
  }
  revalidatePath('/admin/recommendations');
  revalidatePath('/tracker');
  return { success: 'Rekomendasi berhasil dihapus.' };
}

// ==================================================================
// FUNGSI INI DIUBAH DENGAN ATURAN PRIORITAS FINAL ANDA
// ==================================================================
export async function getAnalysisRecommendation(): Promise<Recommendation[]> {
    const supabase = await createClient();
    const session = await auth();
    const user = session?.user;

    if (!user) return [];

    const { data: allEntries, error: entryError } = await supabase
        .from('glucose_entries')
        .select('status')
        .eq('user_id', user.id);

    if (entryError || !allEntries || allEntries.length === 0) {
        return [];
    }
    
    // Hitung jumlah untuk setiap status
    const statusCounts = allEntries.reduce((acc, entry) => {
        const status = entry.status as 'Tinggi' | 'Normal' | 'Rendah';
        if (status) {
            acc[status] = (acc[status] || 0) + 1;
        }
        return acc;
    }, {} as Record<'Tinggi' | 'Normal' | 'Rendah', number>);

    // Buat Set untuk memeriksa keberadaan status dengan mudah
    const userStatuses = new Set(Object.keys(statusCounts));
    
    let targetCategories: string[];

    // --- IMPLEMENTASI LOGIKA PRIORITAS BARU ---
    if (userStatuses.has('Tinggi') && userStatuses.has('Normal')) {
        // Aturan #2 & #3: Jika ada 'Tinggi' dan 'Normal', prioritaskan 'Tinggi'.
        targetCategories = ['Tinggi'];
    } else if (userStatuses.has('Normal') && userStatuses.has('Rendah')) {
        // Aturan #1: Jika ada 'Normal' dan 'Rendah' (tapi tidak ada 'Tinggi'), prioritaskan 'Normal'.
        targetCategories = ['Normal'];
    } else {
        // Aturan #4 (Fallback): Jika tidak ada kombinasi di atas, cari status dominan.
        const priority = ['Tinggi', 'Rendah', 'Normal'] as const;
        let dominantStatus: 'Tinggi' | 'Normal' | 'Rendah' = 'Normal';
        let maxCount = 0;

        for (const status of priority) {
            const currentCount = statusCounts[status] || 0;
            if (currentCount >= maxCount) {
                maxCount = currentCount;
                dominantStatus = status;
            }
        }
        targetCategories = [dominantStatus];
    }
    // --- AKHIR LOGIKA PRIORITAS ---

    try {
        const { data, error: recError } = await supabase
            .from('recommendations')
            .select('*')
            .in('category', targetCategories);

        if (recError || !data || data.length === 0) {
            return [];
        }
        
        const shuffled = data.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 3) as Recommendation[];

    } catch (e) {
        console.error("Error fetching recommendations:", e);
        return [];
    }
}
// ==================================================================


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