'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Skema untuk validasi data makanan
const FoodSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Nama makanan minimal 3 karakter.'),
  sugar_g: z.coerce.number().min(0, 'Gula harus angka positif.'),
});

// Tipe data untuk FormState
export type FoodFormState = {
  success: boolean;
  message?: string;
  errors?: { [key: string]: string[] | undefined; };
};

/**
 * Mengambil semua data makanan dari Firestore, diurutkan berdasarkan nama.
 */
export async function getFoods() {
  try {
    const foodsRef = collection(db, 'foods');
    const q = query(foodsRef, orderBy('name_lowercase', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const foods: any[] = [];
    querySnapshot.forEach((doc) => {
      foods.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return foods;
  } catch (error) {
    console.error("Error getting foods:", error);
    return [];
  }
}

/**
 * Menambah makanan baru ke Firestore.
 */
export async function addFood(prevState: FoodFormState, formData: FormData): Promise<FoodFormState> {
  const validatedFields = FoodSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, sugar_g } = validatedFields.data;

  try {
    await addDoc(collection(db, 'foods'), {
      name,
      name_lowercase: name.toLowerCase(),
      sugar_g
    });

    revalidatePath('/admin/foods');
    return { success: true, message: 'Makanan berhasil ditambahkan.' };
  } catch (e) {
    return { success: false, message: 'Gagal menambahkan makanan.' };
  }
}

/**
 * Mengupdate data makanan di Firestore.
 */
export async function updateFood(prevState: FoodFormState, formData: FormData): Promise<FoodFormState> {
    const validatedFields = FoodSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { id, name, sugar_g } = validatedFields.data;

    if (!id) {
        return { success: false, message: 'ID Makanan tidak valid.' };
    }

    try {
        const foodDoc = doc(db, 'foods', id);
        await updateDoc(foodDoc, {
            name,
            name_lowercase: name.toLowerCase(),
            sugar_g
        });

        revalidatePath('/admin/foods');
        return { success: true, message: 'Makanan berhasil diupdate.' };
    } catch (e) {
        return { success: false, message: 'Gagal mengupdate makanan.' };
    }
}

/**
 * Menghapus data makanan dari Firestore.
 */
export async function deleteFood(formData: FormData): Promise<FoodFormState> {
    const id = formData.get('id') as string;
    if (!id) {
        return { success: false, message: 'ID Makanan tidak valid.' };
    }

    try {
        await deleteDoc(doc(db, 'foods', id));
        revalidatePath('/admin/foods');
        return { success: true, message: 'Makanan berhasil dihapus.' };
    } catch (e) {
        return { success: false, message: 'Gagal menghapus makanan.' };
    }
}
