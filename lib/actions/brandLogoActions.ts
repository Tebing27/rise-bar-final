// lib/actions/brandLogoActions.ts
"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { redirect } from "next/navigation";

// Tipe untuk form utama (tambah/edit logo)
export type LogoFormState = {
  success: boolean;
  message?: string;
  errors?: { [key: string]: string[] | undefined };
};

// Tipe untuk form update judul
export type HeadlineFormState = {
  success: boolean;
  message?: string;
};

const LogoSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Nama logo minimal 2 karakter."),
  image_url: z.string().url("Anda harus mengunggah gambar logo."),
  display_order: z.coerce.number().default(0),
});

// --- FUNGSI BARU UNTUK UPDATE JUDUL ---
export async function updateBrandsHeadline(
  prevState: HeadlineFormState,
  formData: FormData
): Promise<HeadlineFormState> {
  const headline = formData.get("headline") as string;

  if (!headline || headline.length < 3) {
    return { success: false, message: "Judul minimal 3 karakter." };
  }

  try {
    const { error } = await supabaseAdmin
      .from("site_content")
      .update({ content_value: headline })
      .eq("content_key", "brands_headline");

    if (error) throw new Error(error.message);
  } catch (e) {
    return { success: false, message: (e as Error).message };
  }

  revalidatePath("/"); // Revalidasi homepage
  revalidatePath("/admin/logos");
  return { success: true, message: "Judul berhasil diperbarui!" };
}
// --- AKHIR FUNGSI BARU ---

export async function upsertLogo(
  prevState: LogoFormState,
  formData: FormData
): Promise<LogoFormState> {
  const validatedFields = LogoSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { id, ...dataToUpsert } = validatedFields.data;
  const payload = id ? { id, ...dataToUpsert } : dataToUpsert;

  try {
    const { error } = await supabaseAdmin
      .from("brand_logos")
      .upsert(payload, { onConflict: "id" });
    if (error) throw new Error(error.message);
  } catch (e) {
    return { success: false, message: (e as Error).message };
  }

  revalidatePath("/admin/logos");
  revalidatePath("/");
  redirect("/admin/logos");
}

export async function deleteLogo(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  try {
    const { error } = await supabaseAdmin
      .from("brand_logos")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);
  } catch (e) {
    console.error("Delete logo error:", e);
  }

  revalidatePath("/admin/logos");
  revalidatePath("/");
}
