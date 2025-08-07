// lib/actions/userActions.ts
"use server";

import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { createClient } from "@/utils/supabase/server";

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  date_of_birth: string | null;
  gender: string | null;
  diabetes_type: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  onboarding_complete: boolean;
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.user.id)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
  return data as UserProfile;
}

const OnboardingSchema = z.object({
  date_of_birth: z.string().min(1, "Tanggal lahir wajib diisi."),
  gender: z.string().min(1, "Jenis kelamin wajib dipilih."),
  diabetes_type: z.string().min(1, "Tipe diabetes wajib dipilih."),
  height_cm: z.string().optional(),
  weight_kg: z.string().optional(),
});

const ProfileUpdateSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter."),
  date_of_birth: z.string().min(1, "Tanggal lahir wajib diisi."),
  gender: z.string().min(1, "Jenis kelamin wajib dipilih."),
  diabetes_type: z.string().min(1, "Tipe diabetes wajib dipilih."),
  height_cm: z.string().optional(),
  weight_kg: z.string().optional(),
});

export type FormState = {
  // ✅ Perbaikan: Properti 'success' dijadikan opsional agar cocok dengan tipe di client component
  success?: boolean;
  message?: string;
  errors?: { [key: string]: string[] | undefined };
};

export async function completeOnboarding(
  prevState: FormState | null,
  formData: FormData
) {
  const session = await auth();
  if (!session?.user?.id)
    return { success: false, message: "Anda harus login." };

  const validatedFields = OnboardingSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  if (!validatedFields.success) {
    return {
      success: false,
      message: "Data tidak valid.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { height_cm, weight_kg, ...rest } = validatedFields.data;

  const dataToUpdate = {
    ...rest,
    height_cm: height_cm ? parseInt(height_cm, 10) : null,
    weight_kg: weight_kg ? parseFloat(weight_kg) : null,
    onboarding_complete: true,
  };

  const { error } = await supabaseAdmin
    .from("users")
    .update(dataToUpdate)
    .eq("id", session.user.id);
  if (error) {
    console.error("Onboarding update error:", error);
    return { success: false, message: "Gagal menyimpan profil." };
  }

  revalidatePath("/tracker");
  redirect("/tracker");
}

export async function updateUserProfile(
  prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const session = await auth();
  if (!session?.user?.id)
    return { success: false, message: "Anda harus login." };

  const validatedFields = ProfileUpdateSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  if (!validatedFields.success) {
    return {
      success: false,
      message: "Data tidak valid.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { height_cm, weight_kg, ...rest } = validatedFields.data;
  const dataToUpdate = {
    ...rest,
    height_cm: height_cm ? parseInt(height_cm, 10) : null,
    weight_kg: weight_kg ? parseFloat(weight_kg) : null,
  };

  const { error } = await supabaseAdmin
    .from("users")
    .update(dataToUpdate)
    .eq("id", session.user.id);

  if (error) {
    console.error("Profile update error:", error);
    return { success: false, message: "Gagal memperbarui profil." };
  }

  revalidatePath("/profile");
  return { success: true, message: "Profil berhasil diperbarui!" };
}

// --- FUNGSI ADMIN ---

const UserSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Nama minimal 3 karakter."),
  email: z.string().email("Format email tidak valid."),
  role_id: z.string().min(1, "Peran harus dipilih."),
  password: z
    .string()
    .min(6, "Password minimal 6 karakter.")
    .optional()
    .or(z.literal("")),
});

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

  const { id, password, ...userData } = validatedFields.data;

  const dataToUpsert: { [key: string]: unknown; id?: string } = {
    ...userData,
    id: id || undefined,
  };

  if (password) {
    dataToUpsert.password_hash = await bcrypt.hash(password, 10);
  }

  try {
    const { error } = await supabaseAdmin.from("users").upsert(dataToUpsert);
    if (error) throw new Error(error.message);
  } catch (e) {
    return { success: false, message: (e as Error).message };
  }

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function deleteUser(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  try {
    const { error } = await supabaseAdmin.from("users").delete().eq("id", id);
    if (error) throw new Error(error.message);
  } catch (e) {
    console.error("Delete user error:", e);
  }

  revalidatePath("/admin/users");
}
