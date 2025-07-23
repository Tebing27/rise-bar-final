// app/(main)/tracker/new/page.tsx
import TrackerForm from "@/components/tracker/TrackerForm";
import { GoalSettingCard } from "@/components/tracker/GoalSettingCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";

export default function NewTrackerEntryPage() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="container mx-auto max-w-2xl py-10 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Catat Konsumsi Makanan</CardTitle>
                <CardDescription>Masukkan data makanan, mood, dan aktivitas Anda di sini untuk dianalisis.</CardDescription>
              </CardHeader>
              <CardContent>
                <TrackerForm />
              </CardContent>
            </Card>

            <GoalSettingCard />
        </div>
      </div>
    </>
  );
}
