"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  updateHowItWorksContent,
  type HowItWorksFormState,
} from "@/lib/actions/howItWorksActions";
import { getSiteContentAsMap } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import dynamic from "next/dynamic";

const LexicalEditor = dynamic(
  () => import("@/components/admin/LexicalEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="border rounded-md p-4 min-h-[200px] bg-muted animate-pulse"></div>
    ),
  }
);

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {" "}
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Simpan
      Perubahan{" "}
    </Button>
  );
}

export function HowItWorksForm() {
  const [content, setContent] = useState<Record<string, string> | null>(null);
  const initialState: HowItWorksFormState = { success: false };
  const [state, formAction] = useActionState(
    updateHowItWorksContent,
    initialState
  );

  useEffect(() => {
    getSiteContentAsMap().then(setContent);
  }, []);

  useEffect(() => {
    if (state?.errors) {
      toast.error(Object.values(state.errors).flat().join("\n"));
    } else if (state?.message && !state.success) {
      toast.error(state.message);
    }
  }, [state]);

  if (!content) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-64 w-full bg-muted rounded-md animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editor Konten</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="howitworks_pill_text">Teks Pil</Label>
            <Input
              id="howitworks_pill_text"
              name="howitworks_pill_text"
              defaultValue={content.howitworks_pill_text}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="howitworks_headline">Judul Utama</Label>
            <Input
              id="howitworks_headline"
              name="howitworks_headline"
              defaultValue={content.howitworks_headline}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="howitworks_text">Paragraf Teks</Label>
            <LexicalEditor
              name="howitworks_text"
              initialValue={content.howitworks_text || ""}
            />
            {state?.errors?.howitworks_text && (
              <p className="text-destructive text-xs mt-1">
                {state.errors.howitworks_text[0]}
              </p>
            )}
          </div>
          <div className="flex justify-end pt-4">
            <SubmitButton />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
