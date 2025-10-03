"use client";

import { useActionState, useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import {
  updateProductContent,
  type ProductFormState,
} from "@/lib/actions/productSectionActions";
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

const ImageUploader = ({
  label,
  imageUrl,
  setImageUrl,
}: {
  label: string;
  imageUrl: string;
  setImageUrl: (url: string) => void;
}) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <div className="p-4 border rounded-md">
      {imageUrl && (
        <NextImage
          src={imageUrl}
          alt="Preview"
          width={128}
          height={128}
          className="w-32 h-auto object-contain rounded-md mb-4 bg-gray-100 p-2"
        />
      )}
      <CldUploadWidget
        signatureEndpoint="/api/sign-cloudinary-params"
        uploadPreset="rise-bar-uploads"
        onSuccess={(result: CloudinaryUploadResult) => {
          if (typeof result.info === "object" && result.info?.secure_url) {
            setImageUrl(result.info.secure_url);
          }
        }}
      >
        {({ open }) => (
          <Button type="button" variant="outline" onClick={() => open()}>
            <ImageIcon className="w-4 h-4 mr-2" />{" "}
            {imageUrl ? "Ganti" : "Upload"}
          </Button>
        )}
      </CldUploadWidget>
    </div>
  </div>
);

export function ProductForm() {
  const [content, setContent] = useState<Record<string, string> | null>(null);
  const initialState: ProductFormState = { success: false };
  const [state, formAction] = useActionState(
    updateProductContent,
    initialState
  );

  const [tab1Before, setTab1Before] = useState("");
  const [tab1After, setTab1After] = useState("");
  const [tab2Before, setTab2Before] = useState("");
  const [tab2After, setTab2After] = useState("");

  useEffect(() => {
    getSiteContentAsMap().then((data) => {
      setContent(data);
      setTab1Before(data.product_section_tab1_before_image || "");
      setTab1After(data.product_section_tab1_after_image || "");
      setTab2Before(data.product_section_tab2_before_image || "");
      setTab2After(data.product_section_tab2_after_image || "");
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
          <div className="h-96 w-full bg-muted rounded-md animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editor Konten Slider</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-8">
          {/* Hidden inputs for images */}
          <input
            type="hidden"
            name="product_section_tab1_before_image"
            value={tab1Before}
          />
          <input
            type="hidden"
            name="product_section_tab1_after_image"
            value={tab1After}
          />
          <input
            type="hidden"
            name="product_section_tab2_before_image"
            value={tab2Before}
          />
          <input
            type="hidden"
            name="product_section_tab2_after_image"
            value={tab2After}
          />

          <div className="space-y-4 p-4 border rounded-md">
            <h3 className="font-semibold text-lg">Teks Utama Section</h3>
            <div className="space-y-2">
              <Label htmlFor="product_section_pill_text">Teks Pil Hijau</Label>
              <Input
                id="product_section_pill_text"
                name="product_section_pill_text"
                defaultValue={content.product_section_pill_text}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product_section_headline">Judul Utama</Label>
              <Input
                id="product_section_headline"
                name="product_section_headline"
                defaultValue={content.product_section_headline}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product_section_subheadline">Sub-Judul</Label>
              <Input
                id="product_section_subheadline"
                name="product_section_subheadline"
                defaultValue={content.product_section_subheadline}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4 p-4 border rounded-md">
              <h3 className="font-semibold text-lg">Konten Tab 1</h3>
              <div className="space-y-2">
                <Label htmlFor="product_section_tab1_name">Nama Tab 1</Label>
                <Input
                  id="product_section_tab1_name"
                  name="product_section_tab1_name"
                  defaultValue={content.product_section_tab1_name}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product_section_tab1_title">
                  Judul Konten Tab 1
                </Label>
                <Input
                  id="product_section_tab1_title"
                  name="product_section_tab1_title"
                  defaultValue={content.product_section_tab1_title}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product_section_tab1_description">
                  Deskripsi Konten Tab 1
                </Label>
                <Textarea
                  id="product_section_tab1_description"
                  name="product_section_tab1_description"
                  defaultValue={content.product_section_tab1_description}
                  required
                  rows={5}
                />
              </div>
              <ImageUploader
                label="Gambar 'Before' Tab 1"
                imageUrl={tab1Before}
                setImageUrl={setTab1Before}
              />
              <ImageUploader
                label="Gambar 'After' Tab 1"
                imageUrl={tab1After}
                setImageUrl={setTab1After}
              />
            </div>

            <div className="space-y-4 p-4 border rounded-md">
              <h3 className="font-semibold text-lg">Konten Tab 2</h3>
              <div className="space-y-2">
                <Label htmlFor="product_section_tab2_name">Nama Tab 2</Label>
                <Input
                  id="product_section_tab2_name"
                  name="product_section_tab2_name"
                  defaultValue={content.product_section_tab2_name}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product_section_tab2_title">
                  Judul Konten Tab 2
                </Label>
                <Input
                  id="product_section_tab2_title"
                  name="product_section_tab2_title"
                  defaultValue={content.product_section_tab2_title}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product_section_tab2_description">
                  Deskripsi Konten Tab 2
                </Label>
                <Textarea
                  id="product_section_tab2_description"
                  name="product_section_tab2_description"
                  defaultValue={content.product_section_tab2_description}
                  required
                  rows={5}
                />
              </div>
              <ImageUploader
                label="Gambar 'Before' Tab 2"
                imageUrl={tab2Before}
                setImageUrl={setTab2Before}
              />
              <ImageUploader
                label="Gambar 'After' Tab 2"
                imageUrl={tab2After}
                setImageUrl={setTab2After}
              />
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
