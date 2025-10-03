// lib/actions/benefitsActions.ts
"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { redirect } from "next/navigation"; // <-- Pastikan redirect diimpor

export type BenefitsFormState = {
  success: boolean;
  message?: string;
  errors?: { [key: string]: string[] | undefined };
};

const BenefitsContentSchema = z.object({
  benefits_pill_text: z.string().min(3, "Teks pil minimal 3 karakter."),
  benefits_headline: z.string().min(5, "Judul utama minimal 5 karakter."),
  benefits_subheadline1: z.string().min(5, "Sub-judul 1 minimal 5 karakter."),
  benefits_text1: z.string().min(10, "Teks 1 minimal 10 karakter."),
  benefits_image1_url: z
    .string()
    .url("URL gambar 1 tidak valid.")
    .or(z.literal("")),
  benefits_subheadline2: z.string().min(5, "Sub-judul 2 minimal 5 karakter."),
  benefits_text2: z.string().min(10, "Teks 2 minimal 10 karakter."),
  benefits_image2_url: z
    .string()
    .url("URL gambar 2 tidak valid.")
    .or(z.literal("")),
});

// --- PERBAIKAN UTAMA DI FUNGSI INI ---
export async function updateBenefitsContent(
  prevState: BenefitsFormState,
  formData: FormData
): Promise<BenefitsFormState> {
  const validatedFields = BenefitsContentSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    // Jika validasi gagal, kembalikan error seperti biasa
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
    const { error } = await supabaseAdmin
      .from("site_content")
      .upsert(contentData, { onConflict: "content_key" });
    if (error) throw new Error(error.message);
  } catch (e) {
    // Jika ada error database, kita tidak redirect, tapi kembalikan pesan error
    return { success: false, message: (e as Error).message };
  }

  // Jika berhasil, revalidasi cache dan redirect
  revalidatePath("/");
  revalidatePath("/admin/about-section");

  // Alihkan kembali ke halaman form dengan pesan sukses di URL
  redirect("/admin/about-section?status=success");
}
