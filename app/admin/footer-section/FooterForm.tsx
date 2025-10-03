"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  updateFooterContent,
  type FooterFormState,
} from "@/lib/actions/footerActions";
import { getSiteContentAsMap } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Image as ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import NextImage from "next/image";
import { CldUploadWidget } from "next-cloudinary";

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

export function FooterForm() {
  const [content, setContent] = useState<Record<string, string> | null>(null);
  const initialState: FooterFormState = { success: false };
  const [state, formAction] = useActionState(updateFooterContent, initialState);
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    getSiteContentAsMap().then((data) => {
      setContent(data);
      setLogoUrl(data.footer_logo_url || "");
    });
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
        <CardTitle>Editor Konten Footer</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <input type="hidden" name="footer_logo_url" value={logoUrl} />

          <div className="space-y-2">
            <Label>Logo Footer</Label>
            <div className="p-4 border rounded-md">
              {logoUrl && (
                <NextImage
                  src={logoUrl}
                  alt="Preview Logo"
                  width={160}
                  height={33}
                  className="h-8 w-auto object-contain mb-4 bg-gray-100 p-2"
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
                    setLogoUrl(result.info.secure_url);
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
                    {logoUrl ? "Ganti Logo" : "Upload Logo"}
                  </Button>
                )}
              </CldUploadWidget>
            </div>
          </div>

          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="footer_cta_text">
                Teks Tombol CTA (Opsional)
              </Label>
              <Input
                id="footer_cta_text"
                name="footer_cta_text"
                defaultValue={content.footer_cta_text}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="footer_cta_link">Link Tombol CTA</Label>
              <Input
                id="footer_cta_link"
                name="footer_cta_link"
                defaultValue={content.footer_cta_link}
              />
            </div>
          </div> */}

          <div className="space-y-2">
            <Label htmlFor="footer_secondary_text">
              Teks Sekunder (di bawah tombol, opsional)
            </Label>
            <Input
              id="footer_secondary_text"
              name="footer_secondary_text"
              defaultValue={content.footer_secondary_text}
            />
          </div>

          <div className="flex justify-end pt-4">
            <SubmitButton />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
