// lib/actions/trackerActions.ts
'use server';

import { cache } from 'react';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { getBloodSugarStatus, calculateAge } from '@/lib/utils';
import { z } from 'zod';
import { getUserProfile } from './userActions';

// ... (Interface tetap sama)
export interface FoodItem {
  id: string;
  name: string;
  sugar_g: number;
  quantity: number; 
}

export interface GlucoseEntry {
  id: string;
  user_id: string;
  created_at: string;
  food_name: string;
  sugar_g: number;
  age_at_input: number | null;
  condition: string;
  status: 'Tinggi' | 'Normal' | 'Rendah';
  mood?: string | null;
  activity?: string | null;
}

export type FormState = {
  success?: string;
  error?: string;
};

const AddEntrySchema = z.object({
  foods_consumed: z.string().min(3, { message: "Anda harus memilih minimal satu makanan." }),
  condition: z.string().min(1, { message: "Kondisi harus dipilih." }),
  entry_date: z.string().min(1, { message: "Tanggal harus diisi." }),
  entry_time: z.string().min(1, { message: "Waktu harus diisi." }),
  mood: z.string().optional(),
  activity: z.string().optional(),
});

const UpdateEntrySchema = z.object({
    id: z.string(),
    food_name: z.string().min(1, { message: "Nama makanan tidak boleh kosong." }),
    sugar_g: z.coerce.number().min(0, { message: "Gula harus angka positif." }),
    condition: z.string().min(1, { message: "Kondisi harus dipilih." }),
    entry_date: z.string().min(1, { message: "Tanggal harus diisi." }),
    entry_time: z.string().min(1, { message: "Waktu harus diisi." }),
    mood: z.string().optional(),
    activity: z.string().optional(),
});

export async function getFoodsByNames(names: string[]): Promise<FoodItem[]> {
  if (!names || names.length === 0) return [];
  
  try {
    const foodsRef = collection(db, 'foods');
    const q = query(
      foodsRef,
      where('name', 'in', names)
    );

    const querySnapshot = await getDocs(q);
    const foods: FoodItem[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      foods.push({
        id: doc.id,
        name: data.name,
        sugar_g: data.sugar_g,
        quantity: 1 
      });
    });
    return foods;
  } catch (error) {
    console.error("Error getting foods by names:", error);
    return [];
  }
}

export async function searchFoods(searchQuery: string): Promise<FoodItem[]> {
  if (!searchQuery || searchQuery.length < 2) return [];
  const lowerCaseQuery = searchQuery.toLowerCase();
  
  try {
    const foodsRef = collection(db, 'foods');
    const q = query(
      foodsRef,
      where('name_lowercase', '>=', lowerCaseQuery),
      where('name_lowercase', '<=', lowerCaseQuery + '\uf8ff'),
      limit(10)
    );

    const querySnapshot = await getDocs(q);
    const foods: FoodItem[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      foods.push({
        id: doc.id,
        name: data.name,
        sugar_g: data.sugar_g,
        quantity: 1
      });
    });
    return foods;
  } catch (error) {
    console.error("Error searching foods in Firestore:", error);
    return [];
  }
}

const formatFoodName = (foods: FoodItem[]): string => {
  return foods.map(food => 
    food.quantity > 1 ? `${food.name} (${food.quantity}x)` : food.name
  ).join(', ');
};

// ✅ Perbaikan Tipe: Ubah 'any' menjadi 'FormState | null'
export async function addMealEntry(prevState: FormState | null, formData: FormData): Promise<FormState> {
  const supabase = await createClient();
  const userProfile = await getUserProfile();

  if (!userProfile || !userProfile.date_of_birth) {
    return { error: 'Profil pengguna tidak lengkap. Silakan lengkapi profil Anda.' };
  }

  const validatedFields = AddEntrySchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
      return { error: "Semua field wajib diisi dengan benar." };
  }
  
  const { foods_consumed, condition, entry_date, entry_time, mood, activity } = validatedFields.data;
  
  const user_age = calculateAge(userProfile.date_of_birth);

  let foods: FoodItem[];
  try {
    foods = JSON.parse(foods_consumed);
  } catch { // <-- 'e' tidak digunakan, jadi bisa dihapus
    return { error: 'Data makanan tidak valid.' };
  }

  const combinedDateTime = new Date(`${entry_date}T${entry_time}`);
  if (isNaN(combinedDateTime.getTime())) {
    return { error: 'Format tanggal atau waktu tidak valid.' };
  }

  const combinedFoodName = formatFoodName(foods);
  const totalSugar = foods.reduce((acc, food) => acc + (food.sugar_g * food.quantity), 0);
  const status = getBloodSugarStatus(user_age, condition, totalSugar);
  
  const entryToInsert = {
    user_id: userProfile.id,
    created_at: combinedDateTime.toISOString(),
    food_name: combinedFoodName,
    sugar_g: totalSugar,
    age_at_input: user_age,
    condition,
    status,
    mood: mood || null,
    activity: activity || null,
  };

  const { error } = await supabase.from('glucose_entries').insert([entryToInsert]);

  if (error) {
    console.error("Error adding meal entry:", error);
    return { error: 'Gagal menyimpan data ke database.' };
  }

  revalidatePath('/tracker');
  return { success: 'Data makanan berhasil disimpan!' };
}

export const getTrackerEntries = cache(async (filter?: string): Promise<GlucoseEntry[]> => {
  const supabase = await createClient();
  const session = await auth();
  const user = session?.user;

  if (!user) return [];

  let query = supabase
    .from('glucose_entries')
    .select('*')
    .eq('user_id', user.id);

  if (filter && filter !== 'all') {
    const today = new Date();
    today.setUTCHours(23, 59, 59, 999); 

    // ✅ Perbaikan: Ubah 'let' menjadi 'const' karena tidak diubah lagi
    const startDate = new Date();
    startDate.setUTCHours(0, 0, 0, 0);

    switch (filter) {
      case 'today':
        break;
      case 'yesterday':
        startDate.setDate(startDate.getDate() - 1);
        today.setDate(today.getDate() - 1);
        break;
      case 'last3days':
        startDate.setDate(startDate.getDate() - 2);
        break;
      case 'last7days':
        startDate.setDate(startDate.getDate() - 6);
        break;
    }
    query = query.gte('created_at', startDate.toISOString()).lte('created_at', today.toISOString());
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;
    
  if (error) {
      console.error("Error fetching tracker entries:", error);
      return [];
  }
  return data as GlucoseEntry[];
});

// ✅ Perbaikan Tipe: Ubah 'any' menjadi 'FormState | null'
export async function updateTrackerEntry(prevState: FormState | null, formData: FormData): Promise<FormState> {
    const supabase = await createClient();
    const userProfile = await getUserProfile();
  
    if (!userProfile || !userProfile.date_of_birth) {
      return { error: 'Profil pengguna tidak lengkap.' };
    }
  
    const validatedFields = UpdateEntrySchema.safeParse(Object.fromEntries(formData.entries()));
  
    if (!validatedFields.success) {
      return { error: "Semua field wajib diisi dengan benar." };
    }
    
    const { id, food_name, sugar_g, condition, entry_date, entry_time, mood, activity } = validatedFields.data;
    
    const age_at_input = calculateAge(userProfile.date_of_birth);

    const combinedDateTime = new Date(`${entry_date}T${entry_time}`);
    if (isNaN(combinedDateTime.getTime())) {
      return { error: 'Format tanggal atau waktu tidak valid.' };
    }
  
    const status = getBloodSugarStatus(age_at_input, condition, sugar_g);
  
    const { error } = await supabase
      .from('glucose_entries')
      .update({ 
        food_name, 
        sugar_g, 
        age_at_input,
        condition,
        status,
        created_at: combinedDateTime.toISOString(),
        mood: mood || null,
        activity: activity || null,
      })
      .eq('id', id)
      .eq('user_id', userProfile.id);
  
    if (error) {
      console.error("Error updating entry:", error);
      return { error: 'Gagal memperbarui data.' };
    }
  
    revalidatePath('/tracker');
    return { success: 'Data berhasil diperbarui!' };
}

export async function deleteTrackerEntry(id: string): Promise<FormState> {
  const supabase = await createClient();
  const session = await auth();
  const user = session?.user;

  if (!user) return { error: 'Unauthorized' };

  const { error } = await supabase
    .from('glucose_entries')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error("Error deleting entry:", error);
    return { error: 'Gagal menghapus data.' };
  }

  revalidatePath('/tracker');
  return { success: 'Data berhasil dihapus.' };
}