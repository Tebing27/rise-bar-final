// lib/actions/goalActions.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export interface UserGoal {
  id: string;
  user_id: string;
  target_type: 'average_glucose' | 'max_glucose';
  target_value: number;
  is_active: boolean;
}

const GoalSchema = z.object({
  target_type: z.enum(['average_glucose', 'max_glucose']),
  target_value: z.coerce.number().min(50, 'Target harus minimal 50.').max(300, 'Target tidak boleh lebih dari 300.'),
});

export async function upsertUserGoal(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const session = await auth();
  const user = session?.user;

  if (!user) return { error: 'Unauthorized' };

  const validatedFields = GoalSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors.target_value?.[0] || 'Data tidak valid.' };
  }
  
  const { target_type, target_value } = validatedFields.data;

  // Nonaktifkan target lama dengan tipe yang sama
  await supabase
    .from('user_goals')
    .update({ is_active: false })
    .eq('user_id', user.id)
    .eq('target_type', target_type);

  // Buat target baru
  const { error } = await supabase
    .from('user_goals')
    .insert({
      user_id: user.id,
      target_type,
      target_value,
      is_active: true,
    });

  if (error) {
    console.error("Error upserting goal:", error);
    return { error: 'Gagal menyimpan target.' };
  }
  
  revalidatePath('/tracker');
  return { success: 'Target baru berhasil disimpan!' };
}

export async function getActiveUserGoals(): Promise<UserGoal[]> {
  const supabase = await createClient();
  const session = await auth();
  const user = session?.user;

  if (!user) return [];

  const { data, error } = await supabase
    .from('user_goals')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true);
    
  if (error) {
    // Peningkatan logging untuk menampilkan pesan error yang lebih jelas
    console.error("Error fetching goals:", error.message || error);
    return [];
  }
  return data as UserGoal[];
}
