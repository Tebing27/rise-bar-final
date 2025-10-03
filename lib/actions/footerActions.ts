// lib/actions/footerActions.ts
"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { redirect } from "next/navigation";

export type FooterFormState = {
  success: boolean;
  message?: string;
  errors?: { [key: string]: string[] | undefined };
};

const FooterContentSchema = z.object({
  footer_logo_url: z.string().url("URL Logo tidak valid.").or(z.literal("")),
  //   footer_cta_text: z.string().optional(),
  //   footer_cta_link: z.string().optional(),
  footer_secondary_text: z.string().optional(),
});

export async function updateFooterContent(
  prevState: FooterFormState,
  formData: FormData
): Promise<FooterFormState> {
  const validatedFields = FooterContentSchema.safeParse(
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
  redirect("/admin/footer-section?status=success");
}
