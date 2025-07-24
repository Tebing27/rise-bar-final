// app/(main)/tracker/new/page.tsx
import TrackerForm from "@/components/tracker/TrackerForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NewTrackerEntryPage() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="container mx-auto max-w-2xl py-10 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
            <Link href="/tracker">
                <Button variant="ghost">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Kembali ke Dashboard
                </Button>
            </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Catat Konsumsi Makanan</CardTitle>
            <CardDescription>Masukkan data makanan, mood, dan aktivitas Anda di sini untuk dianalisis.</CardDescription>
          </CardHeader>
          <CardContent>
            <TrackerForm />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
