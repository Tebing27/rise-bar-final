// components/admin/ContentForm.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from 'next-cloudinary';
import { Image as ImageIcon, Info } from 'lucide-react';
import { updateSiteContent } from '@/lib/actions/contentActions';
import { toast } from 'sonner';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ContentItem {
  content_key: string;
  content_value: string | null;
  content_type: string | null;
}

export function ContentForm({ contents }: { contents: ContentItem[] }) {
  const [updatedValues, setUpdatedValues] = useState<Record<string, string>>({});

  const handleValueChange = (key: string, value: string) => {
    setUpdatedValues(prev => ({ ...prev, [key]: value }));
  };

  const formAction = async (formData: FormData) => {
    for (const key in updatedValues) {
      formData.set(key, updatedValues[key]);
    }
    const result = await updateSiteContent(formData);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message || 'Gagal menyimpan perubahan.');
    }
  };

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>Editor Konten Website</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Panduan Pengelolaan Konten</AlertTitle>
            <AlertDescription className="space-y-4 mt-2">
              <div>
                <h4 className="font-semibold">Gambar (Logo, Favicon, Hero)</h4>
                <ul className="list-disc pl-5 text-xs text-muted-foreground mt-1 space-y-1">
                  <li>Format Terbaik: Gunakan PNG dengan latar belakang transparan untuk Logo & Favicon. Gunakan JPG untuk gambar besar seperti Hero.</li>
                  <li>Dimensi: Logo & Favicon harus persegi (misal: 64x64px). Gambar Hero sebaiknya lanskap (misal: 1200x630px).</li>
                  <li>Ukuran File: Jaga agar ukuran file sekecil mungkin (Favicon &lt;10KB, Gambar Hero &lt;150KB) untuk menjaga kecepatan website. Gunakan [TinyPNG](https://tinypng.com/) sebelum mengunggah.</li>
                  <li>Akibatnya jika dilanggar: Gambar yang terlalu besar akan membuat website menjadi sangat lambat, terutama di koneksi internet yang lambat.</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold">Teks & Link</h4>
                 <ul className="list-disc pl-5 text-xs text-muted-foreground mt-1 space-y-1">
                  <li>Teks: Usahakan judul tetap singkat. Paragraf yang panjang akan otomatis turun baris (responsive), namun buatlah tetap ringkas agar mudah dibaca.</li>
                   <li>Link: Pastikan menyalin URL lengkap, termasuk `https://`. Selalu periksa link setelah menyimpan.</li>
                  <li>Akibatnya jika dilanggar: Link yang salah akan mengarah ke halaman error dan merusak pengalaman pengguna.</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {contents.map((item) => {
              const currentValue = updatedValues[item.content_key] ?? item.content_value ?? '';
              const isLongText = item.content_key.includes('paragraph') || item.content_key.includes('subheadline');
              
              return (
                <div key={item.content_key} className="space-y-2">
                  <Label htmlFor={item.content_key} className="capitalize">
                    {item.content_key.replace(/_/g, ' ')}
                  </Label>

                  {item.content_type === 'image' ? (
                    <div className='p-4 border rounded-md'>
                      <input type="hidden" name={item.content_key} value={currentValue} />
                      {currentValue && (
                        <Image
                          src={currentValue}
                          alt={item.content_key}
                          width={128}
                          height={128}
                          className="w-32 h-32 object-cover rounded-md mb-4"
                        />
                      )}
                      {/* === PERUBAHAN UTAMA DI SINI === */}
                      <CldUploadWidget
                        signatureEndpoint="/api/sign-cloudinary-params"
                        // Ganti 'rise-bar-uploads' dengan nama preset yang Anda buat di Cloudinary
                        uploadPreset="rise-bar-uploads"
                        onSuccess={(result: CloudinaryUploadWidgetResults) => {
                          if (result.info && typeof result.info === 'object' && 'secure_url' in result.info) {
                            handleValueChange(item.content_key, result.info.secure_url);
                          }
                        }}
                      >
                        {({ open }) => (
                          <Button type="button" variant="outline" onClick={() => open()}>
                            <ImageIcon className="w-4 h-4 mr-2" /> Ganti Gambar
                          </Button>
                        )}
                      </CldUploadWidget>
                    </div>
                  ) : item.content_type === 'link' ? (
                    <Input
                      type="url"
                      id={item.content_key}
                      name={item.content_key}
                      defaultValue={currentValue}
                    />
                  ) : (
                    <Textarea
                      id={item.content_key}
                      name={item.content_key}
                      defaultValue={currentValue}
                      rows={isLongText ? 5 : 2}
                      className={cn(
                        isLongText && "min-h-40 max-h-60 overflow-y-auto"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button type="submit">
            Simpan Semua Perubahan
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}