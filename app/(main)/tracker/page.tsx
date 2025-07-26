// app/(main)/tracker/page.tsx

import React from "react";
import Link from "next/link";
import { getTrackerEntries } from "@/lib/actions/trackerActions";
import { auth } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";
import { DataManagementTabs } from "@/components/tracker/tabs/DataManagementTabs";
import { InsightsTabs } from "@/components/tracker/tabs/InsightsTabs";
import { GoalsTabs } from "@/components/tracker/tabs/GoalsTabs";
import { TrackerHeader } from "@/components/tracker/TrackerHeader";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from 'next/image';

// ---------------------------------------------

export default async function TrackerPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  // Await searchParams sebelum digunakan
  const resolvedSearchParams = await searchParams;
  const dateFilter = resolvedSearchParams?.filter;
  const session = await auth();
  const entries = await getTrackerEntries(dateFilter);
  const userName = session?.user?.name || 'Pengguna';

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-4">
        <TrackerHeader userName={userName} />

        {entries.length === 0 ? (
           <Card className="bg-indigo-50 dark:bg-indigo-900/30 flex flex-col items-center justify-center text-center p-12 min-h-[400px]">
            <Image
                src="/mascot_bertanya.png" // Pastikan gambar ada di folder /public
                alt="Mascot Bertanya"
                width={150}
                height={150}
                className="mb-6"
              />
              <CardTitle className="text-2xl font-semibold">Mulai Perjalanan Kesehatan Anda</CardTitle>
              <CardDescription className="mt-2 max-w-md">
                  Anda belum memiliki catatan apapun. Klik tombol di bawah untuk mulai mencatat dan melihat analisis kesehatan Anda.
              </CardDescription>
              <Link href="/tracker" className="mt-6">
                  <Button size="lg">Catat Data Pertama Anda</Button>
              </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <DataManagementTabs entries={entries} />
            </div>

            <div className="space-y-8">
              <InsightsTabs entries={entries} />
              <GoalsTabs entries={entries} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}