"use client";

import { useState, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import {
  updateBenefitsContent,
  type BenefitsFormState,
} from "@/lib/actions/benefitsActions";
import { getSiteContentAsMap } from "@/lib/content"; // Impor fungsi fetch
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Image as ImageIcon } from "lucide-react";
import NextImage from "next/image";
import { CldUploadWidget } from "next-cloudinary";
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
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Simpan Perubahan
    </Button>
  );
}

export function BenefitsForm() {
  const [content, setContent] = useState<Record<string, string> | null>(null);
  const initialState: BenefitsFormState = { success: false };
  const [state, formAction] = useFormState(updateBenefitsContent, initialState);

  const [image1Url, setImage1Url] = useState("");
  const [image2Url, setImage2Url] = useState("");

  // Ambil data konten saat komponen pertama kali dimuat
  useEffect(() => {
    getSiteContentAsMap().then((data) => {
      setContent(data);
      setImage1Url(data.benefits_image1_url || "");
      setImage2Url(data.benefits_image2_url || "");
    });
  }, []);

  // Tampilkan toast untuk error validasi
  useEffect(() => {
    if (state?.errors) {
      const errorMessages = Object.values(state.errors).flat().join("\n");
      toast.error(errorMessages);
    } else if (state?.message && !state.success) {
      toast.error(state.message);
    }
  }, [state]);

  // Tampilkan loading skeleton jika data belum siap
  if (!content) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 w-1/2 bg-muted rounded-md animate-pulse"></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-10 w-full bg-muted rounded-md animate-pulse"></div>
          <div className="h-24 w-full bg-muted rounded-md animate-pulse"></div>
          <div className="h-24 w-full bg-muted rounded-md animate-pulse"></div>
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
        <form action={formAction} className="space-y-8">
          <input type="hidden" name="benefits_image1_url" value={image1Url} />
          <input type="hidden" name="benefits_image2_url" value={image2Url} />

          <div className="space-y-2">
            <Label htmlFor="benefits_pill_text">Teks Pil Hijau</Label>
            <Input
              id="benefits_pill_text"
              name="benefits_pill_text"
              defaultValue={content.benefits_pill_text}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="benefits_headline">Judul Utama</Label>
            <Input
              id="benefits_headline"
              name="benefits_headline"
              defaultValue={content.benefits_headline}
              required
            />
          </div>

          <hr />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Kolom Kiri */}
            <div className="space-y-6">
              <h3 className="font-semibold text-lg">
                Kolom &ldquo;Mengenal Rise Bar&rdquo;
              </h3>
              <div className="space-y-2">
                <Label htmlFor="benefits_subheadline1">Sub-Judul</Label>
                <Input
                  id="benefits_subheadline1"
                  name="benefits_subheadline1"
                  defaultValue={content.benefits_subheadline1}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="benefits_text1">Paragraf Teks</Label>
                <LexicalEditor
                  name="benefits_text1"
                  initialValue={content.benefits_text1 || ""}
                />
                {state?.errors?.benefits_text1 && (
                  <p className="text-destructive text-xs mt-1">
                    {state.errors.benefits_text1[0]}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Gambar</Label>
                <div className="p-4 border rounded-md">
                  {image1Url && (
                    <NextImage
                      src={image1Url}
                      alt="Preview 1"
                      width={128}
                      height={128}
                      className="w-32 h-32 object-cover rounded-md mb-4"
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
                        setImage1Url(result.info.secure_url);
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
                        {image1Url ? "Ganti" : "Upload"}
                      </Button>
                    )}
                  </CldUploadWidget>
                </div>
              </div>
            </div>

            {/* Kolom Kanan */}
            <div className="space-y-6">
              <h3 className="font-semibold text-lg">
                Kolom &ldquo;Visi Misi&rdquo;
              </h3>
              <div className="space-y-2">
                <Label htmlFor="benefits_subheadline2">Sub-Judul</Label>
                <Input
                  id="benefits_subheadline2"
                  name="benefits_subheadline2"
                  defaultValue={content.benefits_subheadline2}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="benefits_text2">Paragraf Teks</Label>
                <LexicalEditor
                  name="benefits_text2"
                  initialValue={content.benefits_text2 || ""}
                />
                {state?.errors?.benefits_text2 && (
                  <p className="text-destructive text-xs mt-1">
                    {state.errors.benefits_text2[0]}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Gambar</Label>
                <div className="p-4 border rounded-md">
                  {image2Url && (
                    <NextImage
                      src={image2Url}
                      alt="Preview 2"
                      width={128}
                      height={128}
                      className="w-32 h-32 object-cover rounded-md mb-4"
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
                        setImage2Url(result.info.secure_url);
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
                        {image2Url ? "Ganti" : "Upload"}
                      </Button>
                    )}
                  </CldUploadWidget>
                </div>
              </div>
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
