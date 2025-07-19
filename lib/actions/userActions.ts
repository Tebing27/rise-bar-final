'use server';

import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';

// No changes to the schema needed if you've already fixed it from before.
const UserSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Nama minimal 3 karakter.'),
  email: z.string().email('Format email tidak valid.'),
  role_id: z.string().min(1, 'Peran harus dipilih.'), // Assumes role_id is not a UUID
  password: z.string().min(6, 'Password minimal 6 karakter.').optional().or(z.literal('')),
});

// Assuming you are using the state-based action from the previous answer
export type FormState = {
  success: boolean;
  message?: string;
  errors?: { [key: string]: string[] | undefined; };
};

export async function upsertUser(
  prevState: FormState, 
  formData: FormData
): Promise<FormState> {
  const data = Object.fromEntries(formData.entries());
  const validatedFields = UserSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // DESTRUCTURING THE VALIDATED DATA
  const { id, password, ...userData } = validatedFields.data;

  // ✨ THE FIX IS HERE ✨
  // Prepare the data for upsert. If the id is an empty string, treat it as undefined.
  // This tells Supabase to generate a new UUID for a new record.
  const dataToUpsert: { [key: string]: unknown; id?: string } = { 
    ...userData,
    id: id || undefined 
  };

  if (password) {
    dataToUpsert.password_hash = await bcrypt.hash(password, 10);
  }

  try {
    // The data sent to upsert now correctly handles the ID.
    const { error } = await supabaseAdmin.from('users').upsert(dataToUpsert);
    if (error) throw new Error(error.message);
  } catch (e) {
    return { success: false, message: (e as Error).message };
  }

  revalidatePath('/admin/users');
  redirect('/admin/users');
}


export async function deleteUser(formData: FormData) {
    const id = formData.get('id') as string;
    if (!id) return;
    
    try {
        const { error } = await supabaseAdmin.from('users').delete().eq('id', id);
        if(error) throw new Error(error.message);
    } catch (e) {
        console.error("Delete user error:", e);
    }

    revalidatePath('/admin/users');
}