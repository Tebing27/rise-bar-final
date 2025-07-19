// lib/actions/trackerActions.ts
'use server';

import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';
import { getFoodDetails } from './fatsecretActions';

export type FormState = {
  success: boolean;
  message?: string;
  errors?: { [key: string]: string[] | undefined; };
};

const FoodEntrySchema = z.object({
  userId: z.string().uuid(),
  foodIds: z.preprocess((val) => Array.isArray(val) ? val : [val], z.array(z.string())),
  foodNames: z.preprocess((val) => Array.isArray(val) ? val : [val], z.array(z.string())),
});

export async function addFoodEntry(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  console.log('🔍 DEBUG: addFoodEntry called');
  console.log('🔍 DEBUG: Raw form data:', {
    userId: formData.get('userId'),
    foodIds: formData.getAll('foodIds'),
    foodNames: formData.getAll('foodNames'),
  });

  const validatedFields = FoodEntrySchema.safeParse({
    userId: formData.get('userId'),
    foodIds: formData.getAll('foodIds'),
    foodNames: formData.getAll('foodNames'),
  });

  if (!validatedFields.success) {
    console.log('🔍 DEBUG: Validation failed:', validatedFields.error.flatten().fieldErrors);
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { userId, foodIds, foodNames } = validatedFields.data;
  console.log('🔍 DEBUG: Validated data:', { userId, foodIds, foodNames });
  
  try {
    const entriesToInsert = [];
    for (let i = 0; i < foodIds.length; i++) {
      const foodId = foodIds[i];
      const foodName = foodNames[i];

      console.log(`🔍 DEBUG: Processing food ${i + 1}: ${foodName} (ID: ${foodId})`);

      const details = await getFoodDetails(foodId);
      if (!details) {
        console.log(`🔍 DEBUG: No details found for food ${foodId}`);
        continue;
      }

      const serving = Array.isArray(details.servings.serving) 
        ? details.servings.serving[0] 
        : details.servings.serving;
      
      console.log('🔍 DEBUG: Serving data:', serving);

      if (serving && serving.carbohydrate !== undefined) {
        const entry = {
          user_id: userId,
          food_name: foodName,
          estimated_carbs_g: parseFloat(serving.carbohydrate),
        };
        entriesToInsert.push(entry);
        console.log('🔍 DEBUG: Added entry:', entry);
      }
    }
    
    console.log('🔍 DEBUG: Total entries to insert:', entriesToInsert.length);
    console.log('🔍 DEBUG: Entries data:', entriesToInsert);

    if (entriesToInsert.length === 0) {
        throw new Error("Tidak ada data nutrisi valid yang bisa disimpan.");
    }

    // Insert dengan logging
    console.log('🔍 DEBUG: Inserting to Supabase...');
    const { data, error: insertError } = await supabaseAdmin
      .from('glucose_entries')
      .insert(entriesToInsert)
      .select(); // Tambahkan select untuk melihat data yang diinsert

    console.log('🔍 DEBUG: Insert result:', { data, error: insertError });

    if (insertError) {
      console.log('🔍 DEBUG: Insert error details:', insertError);
      throw new Error(insertError.message);
    }

    revalidatePath('/tracker');
    console.log('🔍 DEBUG: Success! Revalidated path.');
    return { success: true, message: `${entriesToInsert.length} makanan berhasil ditambahkan!` };

  } catch (e) {
    const error = e as Error;
    console.log('🔍 DEBUG: Caught error:', error);
    return { success: false, message: `Terjadi kesalahan: ${error.message}` };
  }
}