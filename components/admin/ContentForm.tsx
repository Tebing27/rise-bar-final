// components/admin/ContentForm.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from 'next-cloudinary';
import { Image as ImageIcon, Info } from 'lucide-react';
import { updateSiteContent } from '@/lib/actions/contentActions';
import { toast } from 'sonner';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const LexicalEditor = dynamic(() => import('./LexicalEditor'), {
  ssr: false,
  loading: () => <div className="w-full h-48 bg-muted rounded-md animate-pulse" />,
});


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
    // The Lexical editor will submit its value via the hidden textarea,
    // so we don't need the `updatedValues` state for it.
    // We can keep it for image uploads or other dynamic fields.
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
               {/* ... Panduan tidak berubah ... */}
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {contents.map((item) => {
              const currentValue = updatedValues[item.content_key] ?? item.content_value ?? '';
              
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
                       <CldUploadWidget
                         signatureEndpoint="/api/sign-cloudinary-params"
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
                  ) : item.content_type === 'longtext' ? ( // Check for longtext type
                    <LexicalEditor name={item.content_key} initialValue={currentValue} />
                  ) : (
                    <Textarea
                      id={item.content_key}
                      name={item.content_key}
                      defaultValue={currentValue}
                      rows={item.content_key.includes('paragraph') || item.content_key.includes('subheadline') ? 5 : 2}
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