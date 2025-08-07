// lib/actions/passwordActions.ts
"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { Resend } from "resend";
import { ResetPasswordEmail } from "@/components/emails/ResetPasswordEmail";
import crypto from "crypto";
import bcrypt from "bcryptjs";

// Definisikan tipe state yang konsisten untuk form
export type PasswordFormState = {
  success?: string;
  error?: string;
} | null;

const resend = new Resend(process.env.RESEND_API_KEY);
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// --- FUNGSI PENGIRIMAN LINK RESET (Tidak ada perubahan di sini) ---
export async function sendPasswordResetLink(
  prevState: PasswordFormState,
  formData: FormData
): Promise<PasswordFormState> {
  const email = formData.get("email") as string;
  if (!email) return { error: "Email diperlukan." };

  const supabase = supabaseAdmin;

  const { data: user } = await supabase
    .from("users")
    .select("id, email")
    .eq("email", email)
    .single();

  if (!user) {
    return {
      success:
        "Jika email Anda terdaftar, kami telah mengirimkan link reset password.",
    };
  }

  await supabase.from("password_reset_tokens").delete().eq("user_id", user.id);

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = await bcrypt.hash(token, 10);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 jam

  const { error: tokenError } = await supabase
    .from("password_reset_tokens")
    .insert({
      user_id: user.id,
      token_hash: tokenHash,
      expires_at: expiresAt.toISOString(),
    });

  if (tokenError) {
    console.error("Error saving token:", tokenError);
    return { error: "Gagal membuat token reset. Coba lagi nanti." };
  }

  const resetLink = `${baseUrl}/auth/update-password?token=${token}`;

  try {
    const emailComponent = await ResetPasswordEmail({ resetLink });

    await resend.emails.send({
      from: "noreply@risebar.id",
      to: user.email,
      subject: "Reset Password Akun Rise Bar",
      react: emailComponent,
    });
    return {
      success:
        "Jika email Anda terdaftar, kami telah mengirimkan link reset password.",
    };
  } catch (e) {
    console.error("Email send error:", e);
    return { error: "Gagal mengirim email. Coba lagi nanti." };
  }
}

// --- FUNGSI RESET PASSWORD (Dengan Perbaikan) ---
export async function resetPassword(
  prevState: PasswordFormState,
  formData: FormData
): Promise<PasswordFormState> {
  const password = formData.get("password") as string;
  const token = formData.get("token") as string;

  if (!password || password.length < 6)
    return { error: "Password minimal 6 karakter." };
  if (!token) return { error: "Token tidak valid atau hilang." };

  const supabase = supabaseAdmin;

  // 1. Ambil semua token yang belum kedaluwarsa
  const { data: allTokens, error: allTokensError } = await supabase
    .from("password_reset_tokens")
    .select("*")
    .gt("expires_at", new Date().toISOString());

  if (allTokensError || !allTokens) {
    return { error: "Gagal memverifikasi token. Silakan coba lagi." };
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
    return { error: "Token tidak valid atau sudah kedaluwarsa." };
  }

  // 3. Update password di Supabase Auth (Pintu Utama)
  const { error: updateUserError } = await supabase.auth.admin.updateUserById(
    validTokenData.user_id,
    { password: password }
  );

  if (updateUserError) {
    console.error("Error updating Supabase Auth user:", updateUserError);
    return { error: "Gagal memperbarui password di sistem otentikasi." };
  }

  // 4. ✅ PERBAIKAN: Update juga password_hash di tabel public.users (Pintu Kamar)
  const hashedPassword = await bcrypt.hash(password, 10);
  const { error: updateProfileError } = await supabase
    .from("users")
    .update({ password_hash: hashedPassword })
    .eq("id", validTokenData.user_id);

  if (updateProfileError) {
    console.error("Error updating public user profile:", updateProfileError);
    return { error: "Gagal sinkronisasi password. Silakan coba lagi." };
  }
  // --- AKHIR PERBAIKAN ---

  // 5. Hapus token setelah digunakan
  await supabase
    .from("password_reset_tokens")
    .delete()
    .eq("id", validTokenData.id);

  return {
    success:
      "Password berhasil diperbarui! Anda akan diarahkan ke halaman login.",
  };
}
