// lib/actions/passwordActions.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { Resend } from 'resend';
import { ResetPasswordEmail } from '@/components/emails/ResetPasswordEmail';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// Definisikan tipe state yang konsisten untuk form
export type PasswordFormState = {
  success?: string;
  error?: string;
} | null;

const resend = new Resend(process.env.RESEND_API_KEY);
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// --- FUNGSI PENGIRIMAN LINK RESET ---
export async function sendPasswordResetLink(
  prevState: PasswordFormState,
  formData: FormData
): Promise<PasswordFormState> {
  const email = formData.get('email') as string;
  if (!email) return { error: 'Email diperlukan.' };

  // WAJIB: 'await' createClient() karena ini adalah fungsi async
  const supabase = await createClient();

  // 1. Cari user berdasarkan email
  const { data: user } = await supabase
    .from('users')
    .select('id, email')
    .eq('email', email)
    .single();

  // Jika tidak ada user, tetap kirim pesan sukses untuk keamanan
  if (!user) {
    return { success: 'Jika email Anda terdaftar, kami telah mengirimkan link reset password.' };
  }

  // 2. Hapus token lama & buat yang baru
  await supabase.from('password_reset_tokens').delete().eq('user_id', user.id);

  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = await bcrypt.hash(token, 10);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 jam

  const { error: tokenError } = await supabase
    .from('password_reset_tokens')
    .insert({
      user_id: user.id,
      token_hash: tokenHash,
      expires_at: expiresAt.toISOString(),
    });

  if (tokenError) {
    console.error('Error saving token:', tokenError);
    return { error: 'Gagal membuat token reset. Coba lagi nanti.' };
  }
  
  // 3. Kirim email
const resetLink = `${baseUrl}/auth/update-password?token=${token}`;

try {
  // Await the async component
  const emailComponent = await ResetPasswordEmail({ resetLink });
  
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: user.email,
    subject: 'Reset Password Akun Rise Bar Anda',
    react: emailComponent,
  });
  return { success: 'Jika email Anda terdaftar, kami telah mengirimkan link reset password.' };
} catch (e) {
  console.error('Email send error:', e);
  return { error: 'Gagal mengirim email. Coba lagi nanti.' };
}
}

// --- FUNGSI RESET PASSWORD ---
export async function resetPassword(
  prevState: PasswordFormState,
  formData: FormData
): Promise<PasswordFormState> {
    const password = formData.get('password') as string;
    const token = formData.get('token') as string;

    if (!password || password.length < 6) return { error: 'Password minimal 6 karakter.' };
    if (!token) return { error: 'Token tidak valid atau hilang.' };

    const supabase = await createClient();
    
    // 1. Ambil semua token yang belum kedaluwarsa
    const { data: allTokens, error: allTokensError } = await supabase
        .from('password_reset_tokens')
        .select('*')
        .gt('expires_at', new Date().toISOString());

    if (allTokensError || !allTokens) {
        return { error: 'Gagal memverifikasi token. Silakan coba lagi.' };
    }

    // 2. Lakukan perbandingan hash secara manual
    let validTokenData = null;
    for (const dbToken of allTokens) {
        const isValid = await bcrypt.compare(token, dbToken.token_hash);
        if (isValid) {
            validTokenData = dbToken;
            break;
        }
    }

    if (!validTokenData) {
        return { error: 'Token tidak valid atau sudah kedaluwarsa.' };
    }

    // 3. Update password di Supabase Auth
    const { error: updateUserError } = await supabase.auth.admin.updateUserById(
        validTokenData.user_id,
        { password: password }
    );
    
    if (updateUserError) {
        console.error('Error updating Supabase Auth user:', updateUserError);
        return { error: 'Gagal memperbarui password.' };
    }
    
    // 4. Hapus token setelah digunakan
    await supabase.from('password_reset_tokens').delete().eq('id', validTokenData.id);
    
    return { success: 'Password berhasil diperbarui! Anda akan diarahkan ke halaman login.' };
}