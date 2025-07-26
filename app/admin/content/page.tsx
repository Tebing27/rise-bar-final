// app/admin/content/page.tsx
import { supabaseAdmin } from '@/lib/supabase-admin';
import { ContentForm } from '@/components/admin/ContentForm'; // Import komponen baru
import { Toaster } from '@/components/ui/sonner';

async function getSiteContent() {
  const { data } = await supabaseAdmin.from('site_content').select('*').order('content_key');
  return data || [];
}

export default async function AdminContentPage() {
  const contents = await getSiteContent();

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="mx-auto max-w-4xl py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Kelola Konten Website</h1>
        {/* Render Client Component dan kirim data sebagai props */}
        <ContentForm contents={contents} />
      </div>
    </>
  );
}