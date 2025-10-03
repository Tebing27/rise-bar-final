// lib/actions/howItWorksActions.ts
"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { redirect } from "next/navigation";

export type HowItWorksFormState = {
  success: boolean;
  message?: string;
  errors?: { [key: string]: string[] | undefined };
};

const HowItWorksSchema = z.object({
  howitworks_pill_text: z.string().min(3, "Teks pil minimal 3 karakter."),
  howitworks_headline: z.string().min(5, "Judul minimal 5 karakter."),
  howitworks_text: z.string().min(20, "Teks paragraf minimal 20 karakter."),
});

export async function updateHowItWorksContent(
  prevState: HowItWorksFormState,
  formData: FormData
): Promise<HowItWorksFormState> {
  const validatedFields = HowItWorksSchema.safeParse(
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
  redirect("/admin/how-it-works?status=success");
}
