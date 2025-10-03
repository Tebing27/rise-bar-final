// lib/actions/heroActions.ts
"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export type HeroFormState = {
  success: boolean;
  message?: string;
  errors?: { [key: string]: string[] | undefined };
};

// Skema untuk memvalidasi semua field di Hero Section
const HeroContentSchema = z.object({
  hero_headline: z.string().min(5, "Judul Utama minimal 5 karakter."),
  hero_subheadline: z.string().min(10, "Sub-Judul minimal 10 karakter."),
  hero_image: z.string().url("URL gambar tidak valid.").or(z.literal("")),
  hero_label1: z.string().min(3, "Label 1 minimal 3 karakter."),
  hero_label2: z.string().min(3, "Label 2 minimal 3 karakter."),
  hero_label3: z.string().min(3, "Label 3 minimal 3 karakter."),
});

// Aksi untuk mengupdate semua konten Hero Section
export async function updateHeroContent(
  prevState: HeroFormState,
  formData: FormData
): Promise<HeroFormState> {
  const validatedFields = HeroContentSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const contentData = Object.entries(validatedFields.data).map(
    ([key, value]) => ({
      content_key: key,
      content_value: value,
    })
  );

  try {
    // Gunakan upsert untuk mengupdate semua data sekaligus
    const { error } = await supabaseAdmin
      .from("site_content")
      .upsert(contentData, { onConflict: "content_key" });
    if (error) throw new Error(error.message);
  } catch (e) {
    return { success: false, message: (e as Error).message };
  }

  revalidatePath("/"); // Revalidasi homepage agar menampilkan konten baru
  revalidatePath("/admin/hero"); // Revalidasi halaman admin hero
  return { success: true, message: "Hero Section berhasil diperbarui!" };
}
