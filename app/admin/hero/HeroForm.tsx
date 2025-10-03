"use client";

import { useActionState, useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import {
  updateHeroContent,
  type HeroFormState,
} from "@/lib/actions/heroActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Image as ImageIcon } from "lucide-react";
import NextImage from "next/image";
import {
  CldUploadWidget,
  type CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Simpan Perubahan
    </Button>
  );
}

export function HeroForm({
  currentContent,
}: {
  currentContent: Record<string, string>;
}) {
  const initialState: HeroFormState = { success: false };
  const [state, formAction] = useActionState(updateHeroContent, initialState);
  const [imageUrl, setImageUrl] = useState(currentContent.hero_image || "");

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editor Hero Section</CardTitle>
        <CardDescription>
          Isi semua field di bawah ini untuk memperbarui tampilan hero section.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <input type="hidden" name="hero_image" value={imageUrl} />

          <div className="space-y-2">
            <Label htmlFor="hero_headline">Judul Utama (Headline)</Label>
            <Input
              id="hero_headline"
              name="hero_headline"
              defaultValue={currentContent.hero_headline}
              required
            />
            {state?.errors?.hero_headline && (
              <p className="text-destructive text-xs mt-1">
                {state.errors.hero_headline[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero_subheadline">Sub-Judul (Deskripsi)</Label>
            <Textarea
              id="hero_subheadline"
              name="hero_subheadline"
              defaultValue={currentContent.hero_subheadline}
              required
              rows={4}
            />
            {state?.errors?.hero_subheadline && (
              <p className="text-destructive text-xs mt-1">
                {state.errors.hero_subheadline[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Gambar Produk Utama</Label>
            <div className="p-4 border rounded-md">
              {imageUrl && (
                <NextImage
                  src={imageUrl}
                  alt="Preview"
                  width={128}
                  height={128}
                  className="w-32 h-32 object-contain rounded-md mb-4 bg-gray-100 p-2"
                />
              )}
              <CldUploadWidget
                signatureEndpoint="/api/sign-cloudinary-params"
                uploadPreset="rise-bar-uploads"
                onSuccess={(result: CloudinaryUploadWidgetResults) => {
                  if (
                    result.info &&
                    typeof result.info === "object" &&
                    "secure_url" in result.info
                  ) {
                    setImageUrl(result.info.secure_url as string);
                  }
                }}
              >
                {({ open }) => (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => open()}
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    {imageUrl ? "Ganti Gambar" : "Upload Gambar"}
                  </Button>
                )}
              </CldUploadWidget>
              {state?.errors?.hero_image && (
                <p className="text-destructive text-xs mt-2">
                  {state.errors.hero_image[0]}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hero_label1">Label Keunggulan 1</Label>
              <Input
                id="hero_label1"
                name="hero_label1"
                defaultValue={currentContent.hero_label1}
                required
              />
              {state?.errors?.hero_label1 && (
                <p className="text-destructive text-xs mt-1">
                  {state.errors.hero_label1[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero_label2">Label Keunggulan 2</Label>
              <Input
                id="hero_label2"
                name="hero_label2"
                defaultValue={currentContent.hero_label2}
                required
              />
              {state?.errors?.hero_label2 && (
                <p className="text-destructive text-xs mt-1">
                  {state.errors.hero_label2[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero_label3">Label Keunggulan 3</Label>
              <Input
                id="hero_label3"
                name="hero_label3"
                defaultValue={currentContent.hero_label3}
                required
              />
              {state?.errors?.hero_label3 && (
                <p className="text-destructive text-xs mt-1">
                  {state.errors.hero_label3[0]}
                </p>
              )}
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
