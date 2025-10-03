"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { upsertLogo, type LogoFormState } from "@/lib/actions/brandLogoActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
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

interface Logo {
  id?: string;
  name?: string;
  image_url?: string;
  display_order?: number;
}

function SubmitButton({ isNew }: { isNew: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? "Menyimpan..." : isNew ? "Tambah Logo" : "Update Logo"}
    </Button>
  );
}

export function LogoForm({ logo }: { logo?: Logo }) {
  const initialState: LogoFormState = { success: false };
  const [state, formAction] = useActionState(upsertLogo, initialState);
  const [imageUrl, setImageUrl] = useState(logo?.image_url || "");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{logo ? "Edit Logo" : "Tambah Logo Baru"}</CardTitle>
        <CardDescription>
          {logo
            ? "Perbarui detail logo yang sudah ada."
            : "Upload gambar dan isi detail logo yang akan ditampilkan."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <input type="hidden" name="id" value={logo?.id || ""} />
          <input type="hidden" name="image_url" value={imageUrl} />

          <div className="space-y-2">
            <Label htmlFor="name">Nama Brand/Partner</Label>
            <Input
              id="name"
              name="name"
              defaultValue={logo?.name}
              required
              placeholder="cth: Universitas Brawijaya"
            />
            {state?.errors?.name && (
              <p className="text-destructive text-xs mt-1">
                {state.errors.name[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Gambar Logo</Label>
            <div className="p-4 border rounded-md">
              {imageUrl && (
                <NextImage
                  src={imageUrl}
                  alt="Preview logo"
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
              {state?.errors?.image_url && (
                <p className="text-destructive text-xs mt-2">
                  {state.errors.image_url[0]}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="display_order">Urutan Tampil</Label>
            <Input
              id="display_order"
              name="display_order"
              type="number"
              defaultValue={logo?.display_order || 0}
              required
            />
            <p className="text-xs text-muted-foreground">
              Angka lebih kecil akan tampil lebih dulu di halaman utama.
            </p>
            {state?.errors?.display_order && (
              <p className="text-destructive text-xs mt-1">
                {state.errors.display_order[0]}
              </p>
            )}
          </div>

          <div className="flex justify-end pt-2 gap-2">
            <Link href="/admin/logos">
              <Button type="button" variant="outline">
                Batal
              </Button>
            </Link>
            <SubmitButton isNew={!logo} />
          </div>
          {state?.message && !state.success && (
            <p className="text-destructive text-sm mt-2">{state.message}</p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
