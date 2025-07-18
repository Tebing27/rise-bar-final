// lib/actions/trackerActions.ts
'use server';

import { z } from 'zod';
import { db } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export type FormState = {
  success: boolean;
  message?: string;
  errors?: {
    [key: string]: string[] | undefined;
    _form?: string[];
  };
};

const FoodEntrySchema = z.object({
  userId: z.string().uuid(),
  foodName: z.string().min(2, { message: 'Nama makanan minimal 2 karakter.' }),
  carbs: z.coerce.number().min(0, { message: 'Karbohidrat harus angka positif.' }),
});

export async function addFoodEntry(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = FoodEntrySchema.safeParse({
    userId: formData.get('userId'),
    foodName: formData.get('foodName'),
    carbs: formData.get('carbs'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { userId, foodName, carbs } = validatedFields.data;
  
  try {
    const { error } = await db.from('glucose_entries').insert({
      user_id: userId,
      food_name: foodName,
      estimated_carbs_g: carbs,
    });

    if (error) throw new Error(error.message);

    revalidatePath('/tracker');
    return { success: true, message: `${foodName} berhasil ditambahkan!` };

  } catch (e) {
    const error = e as Error;
    return { success: false, message: error.message };
  }
}