"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ContactForm } from "./ContactForm";
import { Toaster, toast } from "sonner";

export default function AdminContactPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("status") === "success") {
      toast.success('Bagian "Hubungi Kami" berhasil diperbarui!');
    }
  }, [searchParams]);

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold">
            Kelola Bagian &rdquo;Hubungi Kami&rdquo;
          </h1>
          <p className="text-muted-foreground mt-1">
            Ubah semua informasi kontak dan tautan media sosial.
          </p>
        </div>
        <ContactForm />
      </div>
    </>
  );
}
