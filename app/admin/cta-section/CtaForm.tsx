"use client";

import { useActionState, useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { updateCtaContent, type CtaFormState } from "@/lib/actions/ctaActions";
import { getSiteContentAsMap } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Image as ImageIcon } from "lucide-react";
import NextImage from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

// Type untuk result dari Cloudinary
interface CloudinaryUploadWidgetInfo {
  secure_url: string;
}

interface CloudinaryUploadResult {
  info?: string | CloudinaryUploadWidgetInfo;
}

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

export function CtaForm() {
  const [content, setContent] = useState<Record<string, string> | null>(null);
  const initialState: CtaFormState = { success: false };
  const [state, formAction] = useActionState(updateCtaContent, initialState);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    getSiteContentAsMap().then((data) => {
      setContent(data);
      setImageUrl(data.cta_image || "");
    });
  }, []);

  useEffect(() => {
    if (state?.errors) {
      const errorMessages = Object.values(state.errors).flat().join("\n");
      toast.error(errorMessages);
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
        <CardTitle>Editor Konten CTA</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <input type="hidden" name="cta_image" value={imageUrl} />
          <div className="space-y-2">
            <Label htmlFor="cta_headline">Judul</Label>
            <Input
              id="cta_headline"
              name="cta_headline"
              defaultValue={content.cta_headline}
              required
            />
            {state?.errors?.cta_headline && (
              <p className="text-destructive text-xs mt-1">
                {state.errors.cta_headline[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="cta_subheadline">Deskripsi</Label>
            <Textarea
              id="cta_subheadline"
              name="cta_subheadline"
              defaultValue={content.cta_subheadline}
              required
              rows={3}
            />
            {state?.errors?.cta_subheadline && (
              <p className="text-destructive text-xs mt-1">
                {state.errors.cta_subheadline[0]}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cta_button_text">Teks Tombol</Label>
              <Input
                id="cta_button_text"
                name="cta_button_text"
                defaultValue={content.cta_button_text}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cta_button_link">Link Tombol</Label>
              <Input
                id="cta_button_link"
                name="cta_button_link"
                defaultValue={content.cta_button_link}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Ikon Gambar</Label>
            <div className="p-4 border rounded-md">
              {imageUrl && (
                <NextImage
                  src={imageUrl}
                  alt="Preview"
                  width={80}
                  height={80}
                  className="w-20 h-20 object-contain rounded-md mb-4 bg-gray-100 p-2"
                />
              )}
              <CldUploadWidget
                signatureEndpoint="/api/sign-cloudinary-params"
                uploadPreset="rise-bar-uploads"
                onSuccess={(result: CloudinaryUploadResult) => {
                  if (
                    typeof result.info === "object" &&
                    result.info?.secure_url
                  ) {
                    setImageUrl(result.info.secure_url);
                  }
                }}
              >
                {({ open }) => (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => open()}
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />{" "}
                    {imageUrl ? "Ganti Ikon" : "Upload Ikon"}
                  </Button>
                )}
              </CldUploadWidget>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <SubmitButton />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
