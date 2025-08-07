// lib/actions/authActions.ts
"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase-admin";

export type FormState = {
  success: boolean;
  message?: string;
  errors?: { [key: string]: string[] | undefined };
};

const RegisterSchema = z.object({
  name: z.string().min(3, { message: "Nama minimal 3 karakter." }),
  email: z.string().email({ message: "Format email tidak valid." }),
  password: z.string().min(6, { message: "Password minimal 6 karakter." }),
});

export async function registerUser(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
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
  let authUserId: string | undefined = undefined;

  try {
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: { name: name },
      });

    if (authError) {
      if (authError.message.includes("unique constraint")) {
        return { success: false, message: "Email ini sudah terdaftar." };
      }
      throw new Error(authError.message);
    }

    if (!authData.user) {
      return { success: false, message: "Gagal membuat pengguna." };
    }

    authUserId = authData.user.id;

    // Get the 'user' role ID from the database
    const { data: userRole } = await supabaseAdmin
      .from("roles")
      .select("id")
      .eq("name", "user")
      .single();

    if (!userRole) {
      return {
        success: false,
        message: 'Role "user" tidak ditemukan. Hubungi admin.',
      };
    }

    // Hash the password for storage in your public table
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's profile with name, hashed password, AND role_id
    // The database trigger has already created the basic user row.
    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({
        name: name,
        password_hash: hashedPassword,
        role_id: userRole.id, // <-- This is the crucial addition
      })
      .eq("id", authData.user.id);

    if (updateError) throw new Error(updateError.message);

    return { success: true, message: "Registrasi berhasil! Silakan login." };
  } catch (e) {
    const error = e as Error;
    console.error("Registration Error:", error.message);
    if (authUserId) {
      await supabaseAdmin.auth.admin.deleteUser(authUserId);
      console.error(
        `Rollback: Pengguna Auth dengan ID ${authUserId} telah dihapus.`
      );
    }
    return { success: false, message: "Email Anda sudah ada." };
  }
}
