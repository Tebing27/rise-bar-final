// lib/actions/trackerActions.ts
'use server';

import { z } from 'zod';
import { auth } from '@/lib/auth';
import { db } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

// Skema validasi untuk input form
const FoodEntrySchema = z.object({
  foodName: z.string().min(2, { message: 'Nama makanan minimal 2 karakter.' }),
  carbs: z.coerce.number().min(0, { message: 'Karbohidrat harus angka positif.' }),
});

// Fungsi untuk memanggil FatSecret API (masih tiruan/mock)
async function getNutritionFromAPI(foodName: string): Promise<{ carbs: number }> {
  // --- INI HANYA CONTOH ---
  // Nantinya, di sini Anda akan memanggil API FatSecret dengan API Key Anda.
  // Untuk sekarang, kita kembalikan nilai acak agar bisa lanjut development.
  console.log(`Mencari nutrisi untuk: ${foodName}`);
  const randomCarbs = Math.floor(Math.random() * 50) + 5; // Angka acak 5-55
  return Promise.resolve({ carbs: randomCarbs });
}

export type FormState = {
    success: boolean;
    message?: string;
    errors?: {
      // Baris ini mengizinkan properti error apa pun (name, email, foodName, dll)
      [key: string]: string[] | undefined;
      _form?: string[];
    };
  };
  
  // Modifikasi fungsi untuk menerima state sebelumnya
  export async function addFoodEntry(
    prevState: FormState,
    formData: FormData
  ): Promise<FormState> {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: 'Anda harus login.' };
    }
  
    const validatedFields = FoodEntrySchema.safeParse({
      foodName: formData.get('foodName'),
      carbs: formData.get('carbs'),
    });
  
    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

  const { foodName, carbs } = validatedFields.data;
  const userId = session.user.id;

  try {
    // Di sini Anda bisa memilih, mau pakai data karbohidrat dari user atau dari API
    // Untuk sekarang kita pakai data dari user agar lebih simpel.
    // const nutrition = await getNutritionFromAPI(foodName);

    const { error } = await db.from('glucose_entries').insert({
      user_id: userId,
      food_name: foodName,
      estimated_carbs_g: carbs, // Simpan karbohidrat
      // Anda bisa tambahkan estimasi dampak glukosa jika ada rumusnya
    });

    if (error) throw new Error(error.message);

    // Memberitahu Next.js untuk memuat ulang data di halaman tracker
    revalidatePath('/tracker');
    return { success: true, message: `${foodName} berhasil ditambahkan!` };

  } catch (e) {
    const error = e as Error;
    return { success: false, message: error.message };
  }
}