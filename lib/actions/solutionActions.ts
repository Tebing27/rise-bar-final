// lib/actions/solutionActions.ts
'use server';

import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const SolutionSchema = z.object({
  id: z.string().optional(),
  glucose_range: z.string().min(1, 'Rentang glukosa harus diisi.'),
  suggestion: z.string().min(10, 'Saran minimal 10 karakter.'),
});

// Fungsi untuk membuat atau mengupdate solusi
export async function upsertSolution(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const validatedFields = SolutionSchema.safeParse(data);

  if (!validatedFields.success) {
    console.error('Validation errors:', validatedFields.error.flatten().fieldErrors);
    return { success: false, message: 'Input tidak valid.' };
  }

  const { id, ...solutionData } = validatedFields.data;

  try {
    const { error } = await supabaseAdmin.from('solutions').upsert({ id, ...solutionData });
    if (error) throw new Error(error.message);
  } catch (e) {
    return { success: false, message: (e as Error).message };
  }

  revalidatePath('/admin/solutions');
  redirect('/admin/solutions');
}

// Fungsi untuk menghapus solusi
export async function deleteSolution(solutionId: string) {
  try {
    const { error } = await supabaseAdmin.from('solutions').delete().eq('id', solutionId);
    if (error) throw new Error(error.message);
  } catch (e) {
    return { success: false, message: (e as Error).message };
  }

  revalidatePath('/admin/solutions');
}