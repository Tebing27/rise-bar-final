// lib/actions/foodActions.ts
'use server';

import { adminDb } from '@/lib/firebase-admin';
// --- PERBAIKAN DI SINI ---
// Impor tipe spesifik dari Firebase Admin SDK
import type { Query, DocumentData, QueryDocumentSnapshot } from 'firebase-admin/firestore';
// -------------------------
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { notFound } from 'next/navigation';
import { unstable_cache as cache } from 'next/cache';

// Define a proper type for Food data
interface FoodData {
  id: string;
  name: string;
  name_lowercase: string;
  sugar_g: number;
}

const FoodSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Nama makanan minimal 3 karakter.'),
  sugar_g: z.coerce.number().min(0, 'Gula harus angka positif.'),
});

export type FoodFormState = {
  success: boolean;
  message?: string;
  errors?: { [key: string]: string[] | undefined; };
};

export const getFoods = cache(
  async ({ searchQuery = '', page = 1, pageSize = 10 }: { searchQuery?: string; page?: number; pageSize?: number; }) => {
    try {
      const foodsRef = adminDb.collection('foods');
      // --- PERBAIKAN DI SINI: Beri tipe eksplisit ---
      let baseQuery: Query<DocumentData> = foodsRef;

      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        baseQuery = baseQuery
          .where('name_lowercase', '>=', lowerQuery)
          .where('name_lowercase', '<=', lowerQuery + '\uf8ff');
      }
      
      const countSnapshot = await baseQuery.count().get();
      const totalDocs = countSnapshot.data().count;
      const totalPages = Math.ceil(totalDocs / pageSize);

      let dataQuery = baseQuery.orderBy('name_lowercase', 'asc');

      if (page > 1) {
          const offset = (page - 1) * pageSize;
          dataQuery = dataQuery.offset(offset);
      }
      
      dataQuery = dataQuery.limit(pageSize);
      
      const pageDocsSnapshot = await dataQuery.get();
      // --- PERBAIKAN DI SINI: Gunakan tipe FoodData yang tepat ---
      const foods: FoodData[] = pageDocsSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({ 
        id: doc.id, 
        ...doc.data() 
      } as FoodData));

      return { foods, totalPages };

    } catch (error) {
      console.error("Error getting foods:", error);
      return { foods: [], totalPages: 0 };
    }
  },
  ['getFoods'],
  { tags: ['foods-collection'] }
);

export const getFoodById = cache(
  async (id: string) => {
    try {
      const foodDocRef = adminDb.collection('foods').doc(id);
      const docSnap = await foodDocRef.get();

      if (!docSnap.exists) {
        return notFound();
      }
      return { id: docSnap.id, ...docSnap.data() };
    } catch (error) {
      console.error("Error getting food by ID:", error);
      return notFound();
    }
  },
  ['getFoodById'],
  { tags: ['foods-collection'] }
);

const revalidateFoodsCache = () => {
    revalidatePath('/admin/foods', 'layout');
};

export async function addFood(prevState: FoodFormState, formData: FormData): Promise<FoodFormState> {
  const validatedFields = FoodSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validatedFields.success) {
    return { success: false, errors: validatedFields.error.flatten().fieldErrors };
  }
  const { name, sugar_g } = validatedFields.data;
  try {
    await adminDb.collection('foods').add({
      name, name_lowercase: name.toLowerCase(), sugar_g
    });
    revalidateFoodsCache();
    return { success: true, message: 'Makanan berhasil ditambahkan.' };
  } catch (error) {
    console.error("Error adding food:", error);
    return { success: false, message: 'Gagal menambahkan makanan.' };
  }
}

export async function updateFood(prevState: FoodFormState, formData: FormData): Promise<FoodFormState> {
    const validatedFields = FoodSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        return { success: false, errors: validatedFields.error.flatten().fieldErrors };
    }
    const { id, name, sugar_g } = validatedFields.data;
    if (!id) return { success: false, message: 'ID Makanan tidak valid.' };
    try {
        const foodDoc = adminDb.collection('foods').doc(id);
        await foodDoc.update({
            name, name_lowercase: name.toLowerCase(), sugar_g
        });
        revalidateFoodsCache();
        return { success: true, message: 'Makanan berhasil diupdate.' };
    } catch (error) {
        console.error("Error updating food:", error);
        return { success: false, message: 'Gagal mengupdate makanan.' };
    }
}

export async function deleteFood(formData: FormData): Promise<FoodFormState> {
    const id = formData.get('id') as string;
    if (!id) return { success: false, message: 'ID Makanan tidak valid.' };
    try {
        await adminDb.collection('foods').doc(id).delete();
        revalidateFoodsCache();
        return { success: true, message: 'Makanan berhasil dihapus.' };
    } catch (error) {
        console.error("Error deleting food:", error);
        return { success: false, message: 'Gagal menghapus makanan.' };
    }
}