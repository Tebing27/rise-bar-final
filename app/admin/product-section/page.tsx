"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ProductForm } from "./ProductForm";
import { Toaster, toast } from "sonner";

export default function AdminProductPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("status") === "success") {
      toast.success('Bagian "Produk" berhasil diperbarui!');
    }
  }, [searchParams]);

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold">
            Kelola Bagian &ldquo;Produk&ldquo; (Slider)
          </h1>
          <p className="text-muted-foreground mt-1">
            Ubah konten untuk bagian slider before/after.
          </p>
        </div>
        <ProductForm />
      </div>
    </>
  );
}
