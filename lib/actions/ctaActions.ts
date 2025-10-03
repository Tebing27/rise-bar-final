// lib/actions/ctaActions.ts
"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { redirect } from "next/navigation";

export type CtaFormState = {
  success: boolean;
  message?: string;
  errors?: { [key: string]: string[] | undefined };
};

const CtaContentSchema = z.object({
  cta_headline: z.string().min(5, "Judul minimal 5 karakter."),
  cta_subheadline: z.string().min(10, "Deskripsi minimal 10 karakter."),
  cta_button_text: z.string().min(3, "Teks tombol minimal 3 karakter."),
  cta_button_link: z.string().min(1, "Link tombol tidak boleh kosong."),
  cta_image: z.string().url("URL gambar tidak valid.").or(z.literal("")),
});

export async function updateCtaContent(
  prevState: CtaFormState,
  formData: FormData
): Promise<CtaFormState> {
  const validatedFields = CtaContentSchema.safeParse(
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
  redirect("/admin/cta-section?status=success");
}
