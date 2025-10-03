// lib/actions/contactActions.ts
"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { redirect } from "next/navigation";

export type ContactFormState = {
  success: boolean;
  message?: string;
  errors?: { [key: string]: string[] | undefined };
};

const ContactContentSchema = z.object({
  contact_headline: z.string().min(5, "Judul minimal 5 karakter."),
  contact_subheadline: z.string().min(10, "Sub-judul minimal 10 karakter."),
  contact_address: z.string().min(10, "Alamat minimal 10 karakter."),
  contact_email: z.string().email("Format email tidak valid."),
  contact_phone: z.string().min(5, "Nomor telepon minimal 5 karakter."),
  social_instagram_handle: z.string().optional(),
  social_instagram_link: z
    .string()
    .url("URL Instagram tidak valid.")
    .or(z.literal("")),
  social_tiktok_handle: z.string().optional(),
  social_tiktok_link: z
    .string()
    .url("URL TikTok tidak valid.")
    .or(z.literal("")),
  contact_map_url: z
    .string()
    .url("URL Google Maps tidak valid.")
    .or(z.literal("")),
});

export async function updateContactContent(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const validatedFields = ContactContentSchema.safeParse(
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
  redirect("/admin/contact-section?status=success");
}
