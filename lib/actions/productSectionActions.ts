// lib/actions/productSectionActions.ts
"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { redirect } from "next/navigation";

export type ProductFormState = {
  success: boolean;
  message?: string;
  errors?: { [key: string]: string[] | undefined };
};

const ProductContentSchema = z.object({
  product_section_pill_text: z.string().min(3, "Teks pil minimal 3 karakter."),
  product_section_headline: z
    .string()
    .min(5, "Judul utama minimal 5 karakter."),
  product_section_subheadline: z
    .string()
    .min(5, "Sub-judul minimal 5 karakter."),
  product_section_tab1_name: z
    .string()
    .min(3, "Nama Tab 1 minimal 3 karakter."),
  product_section_tab1_title: z
    .string()
    .min(3, "Judul Konten Tab 1 minimal 3 karakter."),
  product_section_tab1_description: z
    .string()
    .min(10, "Deskripsi Tab 1 minimal 10 karakter."),
  product_section_tab1_before_image: z
    .string()
    .url("URL Gambar Before Tab 1 tidak valid.")
    .or(z.literal("")),
  product_section_tab1_after_image: z
    .string()
    .url("URL Gambar After Tab 1 tidak valid.")
    .or(z.literal("")),
  product_section_tab2_name: z
    .string()
    .min(3, "Nama Tab 2 minimal 3 karakter."),
  product_section_tab2_title: z
    .string()
    .min(3, "Judul Konten Tab 2 minimal 3 karakter."),
  product_section_tab2_description: z
    .string()
    .min(10, "Deskripsi Tab 2 minimal 10 karakter."),
  product_section_tab2_before_image: z
    .string()
    .url("URL Gambar Before Tab 2 tidak valid.")
    .or(z.literal("")),
  product_section_tab2_after_image: z
    .string()
    .url("URL Gambar After Tab 2 tidak valid.")
    .or(z.literal("")),
});

export async function updateProductContent(
  prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const validatedFields = ProductContentSchema.safeParse(
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
    const { error } = await supabaseAdmin
      .from("site_content")
      .upsert(contentData, { onConflict: "content_key" });
    if (error) throw new Error(error.message);
  } catch (e) {
    return { success: false, message: (e as Error).message };
  }

  revalidatePath("/");
  redirect("/admin/product-section?status=success");
}
