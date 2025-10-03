import { supabaseAdmin } from "@/lib/supabase-admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteLogo } from "@/lib/actions/brandLogoActions";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { HeadlineForm } from "./HeadlineForm"; // <-- Impor form baru
import { Toaster } from "sonner";

async function getLogosData() {
  const logosPromise = supabaseAdmin
    .from("brand_logos")
    .select("*")
    .order("display_order");
  const headlinePromise = supabaseAdmin
    .from("site_content")
    .select("content_value")
    .eq("content_key", "brands_headline")
    .single();

  const [{ data: logos }, { data: headlineData }] = await Promise.all([
    logosPromise,
    headlinePromise,
  ]);

  return {
    logos: logos || [],
    headline: headlineData?.content_value || "Dipercaya oleh:",
  };
}

export default async function AdminLogosPage() {
  const { logos, headline } = await getLogosData();

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="grid gap-8">
        <div className="flex justify-between items-start">
          <div>
            <Link
              href="/admin/content"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Kelola Konten
            </Link>
            <h1 className="text-3xl font-bold">Kelola Logo Partner</h1>
            <p className="text-muted-foreground">
              Atur judul section dan daftar logo yang tampil di halaman utama.
            </p>
          </div>
          <Link href="/admin/logos/new">
            <Button>+ Tambah Logo</Button>
          </Link>
        </div>

        {/* Form untuk judul diletakkan di sini */}
        <HeadlineForm currentHeadline={headline} />

        <Card>
          <CardHeader>
            <CardTitle>Daftar Logo ({logos.length})</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {logos.map((logo) => (
              <div
                key={logo.id}
                className="p-4 border rounded-lg flex flex-col items-center gap-4"
              >
                <div className="relative w-full h-20">
                  <Image
                    src={logo.image_url}
                    alt={logo.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-sm font-medium text-center">{logo.name}</p>
                <div className="flex gap-2 mt-auto">
                  <Link href={`/admin/logos/edit/${logo.id}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <form action={deleteLogo}>
                    <input type="hidden" name="id" value={logo.id} />
                    <Button variant="destructive" size="sm" type="submit">
                      Hapus
                    </Button>
                  </form>
                </div>
              </div>
            ))}
            {logos.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                Belum ada logo yang ditambahkan.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
