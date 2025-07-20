'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import clientPromise from '@/lib/mongodb';

export interface GlucoseEntry {
  id: string;
  user_id: string;
  food_name: string;
  serving_size: string;
  sugar_g: number;
  notes?: string;
  created_at: string;
}

export interface FormState {
  error?: string;
  success?: string;
}

export interface Solution {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

export async function updateSolution(
  id: string,
  data: { title: string; description: string }
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('solutions')
    .update({
      title: data.title,
      description: data.description,
    })
    .eq('id', id);

  if (error) {
    return { error: error.message || 'Gagal memperbarui solusi.' };
  }
  return {};
}

export async function searchFoods(query: string) {
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
    return [];
  }
}

export async function addTrackerEntry(_state: FormState | null, formData: FormData): Promise<FormState | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const newEntry = {
    user_id: user.id,
    food_name: formData.get('food_name') as string,
    serving_size: formData.get('serving_size') as string,
    sugar_g: parseFloat(formData.get('sugar_g') as string),
    notes: formData.get('notes') as string || undefined,
  };
  const { error } = await supabase.from('glucose_entries').insert([newEntry]);
  if (error) return { error: 'Gagal menambahkan data.' };
  revalidatePath('/tracker');
  return { success: 'Data berhasil ditambahkan.' };
}

export async function getTrackerEntries(): Promise<GlucoseEntry[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('glucose_entries')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching tracker entries:', error);
    return [];
  }
  return data as GlucoseEntry[];
}

export async function deleteTrackerEntry(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { error } = await supabase
    .from('glucose_entries')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);
  if (error) return { error: 'Gagal menghapus data.' };
  revalidatePath('/tracker');
  return { success: 'Data berhasil dihapus.' };
}

export async function getSolutions() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('solutions')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching solutions:', error);
    return [];
  }
  return data;
}