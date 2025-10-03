"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FooterForm } from "./FooterForm";
import { Toaster, toast } from "sonner";

export default function AdminFooterPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("status") === "success") {
      toast.success("Bagian Footer berhasil diperbarui!");
    }
  }, [searchParams]);

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Kelola Footer</h1>
          <p className="text-muted-foreground mt-1">
            Ubah logo, tombol, dan teks yang ada di bagian paling bawah website.
          </p>
        </div>
        <FooterForm />
      </div>
    </>
  );
}
