// components/admin/ContentForm.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  CldUploadWidget,
  type CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { Image as ImageIcon } from "lucide-react";
import { updateSiteContent } from "@/lib/actions/contentActions";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const LexicalEditor = dynamic(() => import("./LexicalEditor"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-48 bg-muted rounded-md animate-pulse" />
  ),
});

interface ContentItem {
  content_key: string;
  content_value: string | null;
  content_type: string | null;
}

const friendlyLabels: Record<string, string> = {
  // Hero Section
  hero_headline: "Judul Utama (di Atas)",
  hero_subheadline: "Sub-Judul (di Bawah Judul Utama)",
  hero_image: "Gambar Produk Utama",
  hero_label1: "Label Keunggulan 1 (cth: Serat Tinggi)",
  hero_label2: "Label Keunggulan 2 (cth: Vitamin)",
  hero_label3: "Label Keunggulan 3 (cth: Praktis)",

  // Brand Logos
  brands_headline: 'Judul Bagian "Dipercaya oleh"',

  // CTA Section
  cta_headline: 'Judul "Cerita di Balik Rise Bar"',
  cta_subheadline: 'Teks Deskripsi "Cerita di Balik Rise Bar"',
  cta_button_text: 'Teks Tombol "Jelajahi Cerita Kami"',
  cta_button_link: 'Link Tombol "Jelajahi Cerita Kami"',
  cta_image: 'Ikon Gambar "Cerita di Balik Rise Bar"',

  // Benefits Section (Tentang Kami)
  benefits_pill_text: 'Teks Pil Hijau "Tentang Kami"',
  benefits_headline: 'Judul Utama "Tentang Kami"',
  benefits_subheadline1: 'Sub-Judul "Mengenal Rise Bar"',
  benefits_text1: 'Paragraf Teks "Mengenal Rise Bar"',
  benefits_image1_url: 'Gambar untuk "Mengenal Rise Bar"',
  benefits_subheadline2: 'Sub-Judul "Visi Misi"',
  benefits_text2: 'Paragraf Teks "Visi Misi"',
  benefits_image2_url: 'Gambar untuk "Visi Misi"',

  // How It Works (Perjalanan Kami)
  howitworks_pill_text: 'Teks Pil Hijau "Perjalanan Kami"',
  howitworks_headline: 'Judul Utama "Perjalanan Kami"',
  howitworks_text: 'Paragraf Teks "Perjalanan Kami"',

  // Product Section (Lebih Dekat dengan Rise Bar)
  product_section_pill_text: 'Teks Pil Hijau "Lebih Dekat dengan Rise Bar"',
  product_section_headline: 'Judul Utama "Lebih Dekat dengan Rise Bar"',
  product_section_subheadline: 'Sub-Judul "Inovasi Pangan Lokal"',
  product_section_tab1_name: "Nama Tab 1 (cth: Tentang Produk)",
  product_section_tab1_title: "Judul Konten Tab 1",
  product_section_tab1_description: "Deskripsi Konten Tab 1",
  product_section_tab1_before_image: 'Gambar "Before" Tab 1',
  product_section_tab1_after_image: 'Gambar "After" Tab 1',
  product_section_tab2_name: "Nama Tab 2 (cth: Filosofi Logo)",
  product_section_tab2_title: "Judul Konten Tab 2",
  product_section_tab2_description: "Deskripsi Konten Tab 2",
  product_section_tab2_before_image: 'Gambar "Before" Tab 2',
  product_section_tab2_after_image: 'Gambar "After" Tab 2',

  // Contact Section (Hubungi Kami)
  contact_headline: 'Judul "Hubungi Kami"',
  contact_subheadline: 'Sub-Judul "Hubungi Kami"',
  contact_address: "Alamat Kantor",
  contact_email: "Alamat Email Kontak",
  contact_phone: "Nomor Telepon/WhatsApp",
  social_instagram_handle: "Username Instagram (tanpa @)",
  social_instagram_link: "Link Lengkap Instagram",
  social_tiktok_handle: "Username TikTok (tanpa @)",
  social_tiktok_link: "Link Lengkap TikTok",
  contact_map_url: "URL Google Maps (Embed)",

  // Footer Section
  footer_brand_name: "Nama Brand di Footer",
  footer_tagline: "Tagline di Footer",
};

const getLabel = (key: string) => {
  return friendlyLabels[key] || key.replace(/_/g, " ");
};

export function ContentForm({ contents }: { contents: ContentItem[] }) {
  const [updatedValues, setUpdatedValues] = useState<Record<string, string>>(
    {}
  );

  const handleValueChange = (key: string, value: string) => {
    setUpdatedValues((prev) => ({ ...prev, [key]: value }));
  };

  const formAction = async (formData: FormData) => {
    for (const key in updatedValues) {
      formData.set(key, updatedValues[key]);
    }
    const result = await updateSiteContent(formData);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message || "Gagal menyimpan perubahan.");
    }
  };

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>Editor Konten Website</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {contents.map((item) => {
              const currentValue =
                updatedValues[item.content_key] ?? item.content_value ?? "";

              return (
                <div key={item.content_key} className="space-y-2">
                  <Label htmlFor={item.content_key} className="capitalize">
                    {getLabel(item.content_key)}
                  </Label>

                  {item.content_type === "image" ? (
                    <div className="p-4 border rounded-md">
                      <input
                        type="hidden"
                        name={item.content_key}
                        value={currentValue}
                      />
                      {currentValue && (
                        <Image
                          src={currentValue}
                          alt={item.content_key}
                          width={128}
                          height={128}
                          className="w-32 h-32 object-cover rounded-md mb-4"
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
                            handleValueChange(
                              item.content_key,
                              result.info.secure_url
                            );
                          }
                        }}
                      >
                        {({ open }) => (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => open()}
                          >
                            <ImageIcon className="w-4 h-4 mr-2" /> Ganti Gambar
                          </Button>
                        )}
                      </CldUploadWidget>
                    </div>
                  ) : item.content_type === "link" ? (
                    <Input
                      type="text"
                      id={item.content_key}
                      name={item.content_key}
                      defaultValue={currentValue}
                    />
                  ) : item.content_type === "longtext" ? ( // Check for longtext type
                    <LexicalEditor
                      name={item.content_key}
                      initialValue={currentValue}
                    />
                  ) : (
                    <Textarea
                      id={item.content_key}
                      name={item.content_key}
                      defaultValue={currentValue}
                      rows={
                        item.content_key.includes("paragraph") ||
                        item.content_key.includes("subheadline")
                          ? 5
                          : 2
                      }
                    />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button type="submit">Simpan Semua Perubahan</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
