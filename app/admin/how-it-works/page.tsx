"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { HowItWorksForm } from "./HowItWorksForm";
import { Toaster, toast } from "sonner";

export default function AdminHowItWorksPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("status") === "success") {
      toast.success('Bagian "Perjalanan Kami" berhasil diperbarui!');
    }
  }, [searchParams]);

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold">
            Kelola Bagian &ldquo;Perjalanan Kami&ldquo;
          </h1>
          <p className="text-muted-foreground mt-1">
            Ubah konten untuk bagian yang menceritakan sejarah Rise Bar.
          </p>
        </div>
        <HowItWorksForm />
      </div>
    </>
  );
}
