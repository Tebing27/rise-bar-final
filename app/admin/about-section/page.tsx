"use client"; // <-- Tambahkan ini untuk menjadikannya Client Component

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { BenefitsForm } from "./BenefitsForm";
import { Toaster, toast } from "sonner";
// Hapus pengambilan data server-side dari sini karena form akan menanganinya

export default function AdminAboutPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "success") {
      toast.success('Bagian "Tentang Kami" berhasil diperbarui!');
    }
  }, [searchParams]);

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold">
            Kelola Bagian &ldquo;Tentang Kami&rdquo;
          </h1>
          <p className="text-muted-foreground mt-1">
            Ubah konten untuk bagian &ldquo;Tentang Kami&rdquo; dan &ldquo;Visi
            Misi&rdquo;.
          </p>
        </div>
        <BenefitsForm />
      </div>
    </>
  );
}
