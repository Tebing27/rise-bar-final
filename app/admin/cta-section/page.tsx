"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CtaForm } from "./CtaForm";
import { Toaster, toast } from "sonner";

export default function AdminCtaPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("status") === "success") {
      toast.success('Bagian "Cerita di Balik Rise Bar" berhasil diperbarui!');
    }
  }, [searchParams]);

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold">
            Kelola Bagian &ldquo;Cerita di Balik Rise Bar&ldquo;
          </h1>
          <p className="text-muted-foreground mt-1">
            Ubah konten untuk bagian CTA (Call to Action) ini.
          </p>
        </div>
        <CtaForm />
      </div>
    </>
  );
}
