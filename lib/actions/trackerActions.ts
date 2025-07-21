'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { getBloodSugarStatus } from '@/lib/utils'; // <-- INI PERBAIKANNYA

// Tipe data untuk item makanan dari Firestore
export interface FoodItem {
  id: string;
  name: string;
  sugar_g: number;
}

// Tipe data untuk entri glukosa yang disimpan di Supabase
export interface GlucoseEntry {
  id: string;
  user_id: string;
  created_at: string;
  food_name: string;
  sugar_g: number;
  age_at_input: number | null;
  condition: string;
  status: 'Tinggi' | 'Normal' | 'Rendah';
}

// Tipe data untuk state form
export type FormState = {
  success?: string;
  error?: string;
};

/**
 * Mencari makanan dari koleksi 'foods' di Firestore.
 */
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
        sugar_g: data.sugar_g
      });
    });

    return foods;
  } catch (error) {
    console.error("Error searching foods in Firestore:", error);
    return [];
  }
}

/**
 * Menambahkan entri makanan ke tabel 'glucose_entries' di Supabase.
 */
export async function addMealEntry(
  prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();
  const session = await auth();
  const user = session?.user;
  console.log('Session:', session); // Cek session
  console.log('User ID:', session?.user?.id); // Cek user ID

  if (!user) return { error: 'Unauthorized. Silakan login terlebih dahulu.' };

  const foodsJson = formData.get('foods_consumed') as string;
  const userAge = formData.get('user_age') as string;
  const condition = formData.get('condition') as string;
  const entryTime = new Date();

  if (!foodsJson || foodsJson === '[]') {
    return { error: 'Anda harus memilih minimal satu makanan.' };
  }
  if (!userAge) {
    return { error: 'Usia wajib diisi.' };
  }
  if (!condition) {
    return { error: 'Kondisi wajib dipilih.' };
  }

  let foods: FoodItem[];
  try {
    foods = JSON.parse(foodsJson);
  } catch (e) {
    return { error: 'Data makanan tidak valid.' };
  }
  
  const age = parseInt(userAge, 10);
  if (isNaN(age)) {
    return { error: 'Usia harus berupa angka.' };
  }

  // Membuat array entri untuk setiap makanan yang dipilih
  const entriesToInsert = foods.map(food => {
    user_id: session.user.id
    // Menghitung total gula darah (simulasi, karena kita tidak punya data gula darah asli)
    // Di sini kita asumsikan `sugar_g` adalah representasi kadar gula darah untuk perhitungan status
    const glucoseLevel = food.sugar_g; 
    const status = getBloodSugarStatus(age, condition, glucoseLevel);
    
    return {
      user_id: user.id,
      created_at: entryTime.toISOString(),
      food_name: food.name,
      sugar_g: food.sugar_g,
      age_at_input: age,
      condition: condition,
      status: status
    };
  });

  const { error } = await supabase.from('glucose_entries').insert(entriesToInsert);

  if (error) {
    console.error("Error adding meal entry:", error);
    return { error: 'Gagal menyimpan data ke database.' };
  }

  revalidatePath('/tracker');
  return { success: 'Data makanan berhasil disimpan!' };
}

/**
 * Mengambil semua entri glukosa milik pengguna dari Supabase.
 */
export async function getTrackerEntries(): Promise<GlucoseEntry[]> {
  const supabase = await createClient();
  const session = await auth();
  const user = session?.user;

  if (!user) return [];

  const { data, error } = await supabase
    .from('glucose_entries')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
    
  if (error) {
      console.error("Error fetching tracker entries:", error);
      return [];
  }
  return data as GlucoseEntry[];
}

/**
 * Menghapus satu entri glukosa dari Supabase.
 */
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

// // Test function - tambahkan ini sementara
// export async function testSupabaseAuth() {
//   const supabase = await createClient();
//   const { data: { user } } = await supabase.auth.getUser();
//   console.log('Supabase user:', user);
//   return user;
// }