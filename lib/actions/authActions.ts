// lib/actions/authActions.ts
'use server';

import { z } from 'zod';
import bcrypt from 'bcryptjs';
// Gunakan client admin yang baru!
import { supabaseAdmin } from '@/lib/supabase-admin'; 
import type { FormState } from './trackerActions';

// Skema validasi untuk registrasi
const RegisterSchema = z.object({
  name: z.string().min(3, { message: 'Nama minimal 3 karakter.' }),
  email: z.string().email({ message: 'Format email tidak valid.' }),
  password: z.string().min(6, { message: 'Password minimal 6 karakter.' }),
});

export async function registerUser(
    prevState: FormState,
    formData: FormData
  ): Promise<FormState> {
  // 1. Validasi input
  const validatedFields = RegisterSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    // 2. Cek apakah email sudah terdaftar
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return { success: false, message: 'Email ini sudah terdaftar.' };
    }

    // 3. Dapatkan role 'user' dari database (menggunakan admin client)
    const { data: userRole } = await supabaseAdmin
      .from('roles')
      .select('id')
      .eq('name', 'user')
      .single();

    if (!userRole) {
        return { success: false, message: 'Role "user" tidak ditemukan.' };
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Simpan user baru ke database (menggunakan admin client)
    const { error } = await supabaseAdmin.from('users').insert({
      name,
      email,
      password_hash: hashedPassword,
      role_id: userRole.id,
    });

    if (error) throw new Error(error.message);

    return { success: true, message: 'Registrasi berhasil! Silakan login.' };
  } catch (e) {
    const error = e as Error;
    // Log error ini ke terminal untuk debugging
    console.error('Registration Error:', error.message);
    return { success: false, message: 'Terjadi kesalahan pada server.' };
  }
}