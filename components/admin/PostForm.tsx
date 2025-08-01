// components/admin/PostForm.tsx
'use client';

import { useActionState, useState } from 'react';
import { useSession } from 'next-auth/react';
import type { BlogFormState } from '@/lib/actions/blogActions';
import { upsertPost } from '@/lib/actions/blogActions';
import { PostFormButton } from './PostFormButton';
import Image from 'next/image';
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from 'next-cloudinary';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';

// Pastikan Anda mengimpor file editor yang benar.
// Jika Anda mengganti nama file menjadi RichTextEditor.tsx, ubah juga di sini.
const LexicalEditor = dynamic(() => import('./LexicalEditor'), { 
  ssr: false,
  loading: () => <div className="border rounded-md p-4 min-h-[150px] bg-muted animate-pulse"></div> 
});

interface Post {
  id?: string;
  title?: string;
  slug?: string;
  author_name?: string;
  image_url?: string;
  content?: string;
  is_published?: boolean;
  is_popular?: boolean;
}

export function PostForm({ post, tags }: { post?: Post | null; tags?: string; }) {
  const { data: session } = useSession();
  const initialState: BlogFormState = { success: false };
  const [state, formAction] = useActionState(upsertPost, initialState);
  const [imageUrl, setImageUrl] = useState(post?.image_url || '');
  
  const authorName = session?.user?.name ?? 'Admin';

  return (
    <form action={formAction}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Kolom Kiri */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Detail Artikel</CardTitle>
              <CardDescription>Isi judul, slug, dan konten utama artikel.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              {post?.id && <input type="hidden" name="id" value={post.id} />}
              <input type="hidden" name="author_name" value={authorName} />
              <input type="hidden" name="image_url" value={imageUrl} />

              <div className="grid gap-3">
                <Label htmlFor="title">Judul Artikel</Label>
                <Input id="title" name="title" type="text" defaultValue={post?.title} required />
                {state.errors?.title && <p className="text-destructive text-xs">{state.errors.title[0]}</p>}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="slug">URL</Label>
                <Input id="slug" name="slug" type="text" defaultValue={post?.slug} required />
                {state.errors?.slug && <p className="text-destructive text-xs">{state.errors.slug[0]}</p>}
              </div>
              <div className="grid gap-3">
                <Label>Penulis</Label>
                <Input type="text" value={authorName} readOnly className="bg-muted" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="content">Konten</Label>
                {/* ✅ PERBAIKAN DI SINI:
                    - Menghapus prop 'onChange' dan state 'content' yang tidak perlu.
                    - Editor akan menangani nilainya sendiri dan mengirimkannya lewat form.
                */}
                <LexicalEditor
                  name="content"
                  initialValue={post?.content || ''}
                />
                {state.errors?.content && <p className="text-destructive text-xs">{state.errors.content[0]}</p>}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Kolom Kanan (tidak ada perubahan) */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Gambar Utama</CardTitle>
            </CardHeader>
            <CardContent>
              <CldUploadWidget
                signatureEndpoint="/api/sign-cloudinary-params"
                uploadPreset="rise-bar-uploads"
                onSuccess={(result: CloudinaryUploadWidgetResults) => {
                  if (result.info && typeof result.info === 'object' && 'secure_url' in result.info) {
                    setImageUrl(result.info.secure_url as string);
                  }
                }}
              >
                {({ open }) => (
                  <button type="button" onClick={() => open()} className="w-full">
                    {imageUrl ? (
                        <Image src={imageUrl} alt="Preview" width={300} height={150} className="w-full h-auto rounded-md object-cover border" />
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed p-8 text-center h-32">
                            <p className="text-sm text-muted-foreground">Klik untuk upload</p>
                        </div>
                    )}
                  </button>
                )}
              </CldUploadWidget>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Properti</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="tags">Tags (pisahkan dengan koma)</Label>
                <Input id="tags" name="tags" type="text" defaultValue={tags} placeholder="diet, sehat, tips" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="is_published">Publikasikan</Label>
                <Switch id="is_published" name="is_published" defaultChecked={post?.is_published} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="is_popular">Jadikan Populer</Label>
                <Switch id="is_popular" name="is_popular" defaultChecked={post?.is_popular} />
              </div>
            </CardContent>
          </Card>
          
          <div className="flex items-center justify-end gap-2">
            <Link href="/admin/blogs">
              <Button variant="outline">Kembali</Button>
            </Link>
            <PostFormButton isNew={!post} />
          </div>
           {state.message && !state.success && <p className="text-destructive text-sm mt-2">{state.message}</p>}
        </div>
      </div>
    </form>
  );
}