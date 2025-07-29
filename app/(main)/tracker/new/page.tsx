// app/(main)/tracker/new/page.tsx
'use client'; // <-- TAMBAHKAN BARIS INI

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import Image from "next/image";
import dynamic from 'next/dynamic';

// Jadikan TrackerForm dinamis
const TrackerForm = dynamic(() => import("@/components/tracker/TrackerForm"), {
  loading: () => <p className="text-center py-8">Memuat form...</p>,
  ssr: false,
});

export default function NewTrackerEntryPage() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Image
                src="/mascot_berjelajah.webp"
                alt="Mascot Onboarding"
                width={120}
                height={120}
              />
            </div>
            <CardTitle className="text-2xl">Catat Asupan Makanan</CardTitle>
            <CardDescription>
              Lacak makananmu untuk mendapatkan analisis kesehatan yang akurat.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TrackerForm />
          </CardContent>
        </Card>
      </div>
    </>
  );
}