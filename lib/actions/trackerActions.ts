'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import clientPromise from '@/lib/mongodb';
import { auth } from '@/lib/auth'; // Pastikan path ini benar

// Tipe data (tidak ada perubahan di sini)
export interface FoodItem {
  _id: string;
  name: string;
  serving_size: string;
  sugar_g: number;
}

export interface GlucoseEntry {
  id: string;
  user_id: string;
  created_at: string;
  foods_consumed: FoodItem[];
  total_sugar_g: number;
  user_age?: number;
  condition?: string;
  // Tambahkan properti ini agar sesuai dengan data dari page.tsx
  food_name: string;
  serving_size?: string;
  sugar_g?: number;
  notes?: string;
}

export type FormState = {
  success?: string;
  error?: string;
};

// Fungsi searchFoods (tidak ada perubahan)
export async function searchFoods(query: string): Promise<FoodItem[]> {
  if (!query) return [];
  try {
    const mongoClient = await clientPromise;
    const db = mongoClient.db('RiseBar');
    const foods = await db
      .collection('foods')
      .find({ name: { $regex: query, $options: 'i' } })
      .limit(10)
      .toArray();
    return JSON.parse(JSON.stringify(foods));
  } catch (error) {
    console.error("Error searching foods:", error);
    return [];
  }
}

// Fungsi addMealEntry (sudah benar, tidak ada perubahan)
export async function addMealEntry(
  prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient(); // `await` sudah ada di sini
  const session = await auth();
  const user = session?.user;

  if (!user) return { error: 'Unauthorized. Silakan login terlebih dahulu.' };

  const foodsJson = formData.get('foods_consumed') as string;
  const userAge = formData.get('user_age') as string;
  const condition = formData.get('condition') as string;

  if (!foodsJson || foodsJson === '[]') {
    return { error: 'Anda harus memilih minimal satu makanan.' };
  }

  let foods: FoodItem[];
  try {
    foods = JSON.parse(foodsJson);
  } catch (e) {
    return { error: 'Data makanan tidak valid.' };
  }

  const totalSugar = foods.reduce((acc, food) => acc + food.sugar_g, 0);

  const newEntry = {
    user_id: user.id,
    foods_consumed: foods,
    total_sugar_g: totalSugar,
    user_age: userAge ? parseInt(userAge) : null,
    condition: condition,
  };

  const { error } = await supabase.from('glucose_entries').insert([newEntry]);

  if (error) {
    console.error("Error adding meal entry:", error);
    return { error: 'Gagal menyimpan data ke database.' };
  }

  revalidatePath('/tracker');
  return { success: 'Data makanan berhasil disimpan!' };
}

// Mengambil semua entri (dengan perbaikan)
export async function getTrackerEntries(): Promise<GlucoseEntry[]> {
  const supabase = await createClient(); // <-- PERBAIKAN 1: Tambahkan 'await'
  const session = await auth(); // <-- PERBAIKAN 2: Gunakan sesi NextAuth
  const user = session?.user;

  if (!user) return []; // Jika tidak ada user, kembalikan array kosong

  const { data, error } = await supabase
    .from('glucose_entries')
    .select('*')
    .eq('user_id', user.id) // <-- PERBAIKAN 3: Ambil data milik user yang login saja
    .order('created_at', { ascending: false });
    
  if (error) {
      console.error("Error fetching tracker entries:", error);
      return [];
  }
  return data as GlucoseEntry[];
}

// Menghapus entri (dengan perbaikan)
export async function deleteTrackerEntry(id: string): Promise<FormState> {
  const supabase = await createClient(); // <-- PERBAIKAN 1: Tambahkan 'await'
  const session = await auth(); // <-- PERBAIKAN 2: Gunakan sesi NextAuth
  const user = session?.user;

  if (!user) return { error: 'Unauthorized' };

  // Validasi tambahan: pastikan user hanya bisa menghapus datanya sendiri
  const { error } = await supabase
    .from('glucose_entries')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id); // <-- PERBAIKAN 3: Tambahkan cek user_id

  if (error) {
    console.error("Error deleting entry:", error);
    return { error: 'Gagal menghapus data.' };
  }

  revalidatePath('/tracker');
  return { success: 'Data berhasil dihapus.' };
}