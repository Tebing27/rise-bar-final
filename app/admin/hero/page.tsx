import { HeroForm } from "./HeroForm";
import { Toaster } from "@/components/ui/sonner";
import { getSiteContentAsMap } from "@/lib/content";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function AdminHeroPage() {
  // Ambil semua data konten sekaligus
  const content = await getSiteContentAsMap();

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <Link
            href="/admin/content"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Kelola Konten
          </Link>
          <h1 className="text-3xl font-bold">Kelola Hero Section</h1>
          <p className="text-muted-foreground mt-1">
            Ubah judul, teks, dan gambar yang tampil di bagian paling atas
            halaman utama.
          </p>
        </div>
        <HeroForm currentContent={content} />
      </div>
    </>
  );
}
