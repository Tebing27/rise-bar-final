// app/(main)/tracker/new/page.tsx
import TrackerForm from "@/components/tracker/TrackerForm";
import { GoalSettingCard } from "@/components/tracker/GoalSettingCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getUserProfile } from "@/lib/actions/userActions";
import { calculateAge } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function NewTrackerEntryPage() {
  const userProfile = await getUserProfile();

  // Jika profil tidak ada atau onboarding belum selesai, arahkan paksa.
  if (!userProfile || !userProfile.onboarding_complete || !userProfile.date_of_birth) {
    redirect('/onboarding');
  }

  // Hitung usia dari profil
  const age = calculateAge(userProfile.date_of_birth);

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
        <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Catat Konsumsi Makanan</CardTitle>
                {/* Tampilkan usia yang dihitung otomatis */}
                <CardDescription>Usia Anda ({age} tahun) akan digunakan secara otomatis untuk analisis.</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Panggil TrackerForm tanpa prop userAge */}
                <TrackerForm />
              </CardContent>
            </Card>

            <GoalSettingCard />
        </div>
      </div>
    </>
  );
}
