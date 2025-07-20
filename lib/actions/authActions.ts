// lib/actions/authActions.ts
'use server';

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache'; // Diperlukan untuk redirect

// Definisikan FormState di sini agar tidak bergantung pada file lain
export type FormState = {
  success: boolean;
  message?: string;
  errors?: { [key: string]: string[] | undefined; };
};

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
    // ===== LANGKAH KRUSIAL DIMULAI DI SINI =====

    // 2. Buat pengguna di sistem Auth Supabase terlebih dahulu
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Asumsikan email langsung terkonfirmasi
      user_metadata: {
        name: name,
      }
    });

    if (authError) {
      // Tangani jika email sudah ada atau error lain
      if (authError.message.includes('unique constraint')) {
        return { success: false, message: 'Email ini sudah terdaftar.' };
      }
      throw new Error(authError.message);
    }

    if (!authData.user) {
      return { success: false, message: 'Gagal membuat pengguna di sistem auth.' };
    }

    // 3. Dapatkan role 'user' dari database
    const { data: userRole } = await supabaseAdmin
      .from('roles')
      .select('id')
      .eq('name', 'user')
      .single();

    if (!userRole) {
      return { success: false, message: 'Role "user" tidak ditemukan.' };
    }

    // 4. Hash password (tetap diperlukan untuk login via CredentialsProvider)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Simpan data tambahan ke tabel `public.users` Anda
    //    Gunakan ID dari pengguna yang baru dibuat di sistem auth
    const { error: publicUserError } = await supabaseAdmin.from('users').insert({
      id: authData.user.id, // <-- PENTING: Gunakan ID dari auth.users
      name,
      email,
      password_hash: hashedPassword,
      role_id: userRole.id,
    });

    if (publicUserError) {
      // Jika langkah ini gagal, hapus user dari auth agar konsisten
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw new Error(publicUserError.message);
    }

    return { success: true, message: 'Registrasi berhasil! Silakan login.' };

  } catch (e) {
    const error = e as Error;
    console.error('Registration Error:', error.message);
    return { success: false, message: 'Terjadi kesalahan pada server.' };
  }
}