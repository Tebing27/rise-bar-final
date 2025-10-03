// lib/actions/testimonialActions.ts
"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { redirect } from "next/navigation";

export type TestimonialFormState = {
  success: boolean;
  message?: string;
  errors?: { [key: string]: string[] | undefined };
};

const TestimonialSchema = z.object({
  id: z.string().optional(),
  quote: z.string().min(10, "Kutipan minimal 10 karakter."),
  author: z.string().min(3, "Nama autor minimal 3 karakter."),
  initials: z.string().max(3, "Inisial maksimal 3 karakter."),
  customer_since: z.string().optional(),
  stars: z.coerce.number().min(1).max(5, "Rating harus antara 1 dan 5."),
});

// Aksi untuk membuat atau mengupdate testimoni
export async function upsertTestimonial(
  prevState: TestimonialFormState,
  formData: FormData
): Promise<TestimonialFormState> {
  const validatedFields = TestimonialSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // --- PERBAIKAN DI SINI ---
  const { id, ...dataToUpsert } = validatedFields.data;

  // Jika id-nya adalah string kosong (dari form 'Tambah Baru'),
  // buat objek baru tanpa properti 'id' agar Supabase bisa auto-generate.
  // Jika id ada (dari form 'Edit'), sertakan dalam objek.
  const payload = id ? { id, ...dataToUpsert } : dataToUpsert;
  // --- AKHIR PERBAIKAN ---

  try {
    const { error } = await supabaseAdmin.from("testimonials").upsert(payload);
    if (error) throw new Error(error.message);
  } catch (e) {
    return { success: false, message: (e as Error).message };
  }

  revalidatePath("/admin/testimonials");
  revalidatePath("/"); // Revalidasi homepage juga
  redirect("/admin/testimonials");
}

// Aksi untuk menghapus testimoni
export async function deleteTestimonial(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  try {
    const { error } = await supabaseAdmin
      .from("testimonials")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);
  } catch (e) {
    console.error("Delete testimonial error:", e);
  }

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}
