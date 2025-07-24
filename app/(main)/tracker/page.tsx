// app/(main)/tracker/page.tsx
import React, { Suspense } from "react";
import Link from "next/link";
import { getTrackerEntries, type GlucoseEntry } from "@/lib/actions/trackerActions";
import { getAnalysisRecommendation, getPersonalizedInsights } from "@/lib/actions/recommendationActions";
import { DeleteEntryButton } from "@/components/tracker/DeleteEntryButton";
import EditEntryDialog from "@/components/tracker/EditEntryDialog";
import TrackerChart from "@/components/tracker/TrackerChart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Toaster } from "@/components/ui/sonner";
import { BarChart, History, PlusCircle, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { StatusHighlightCard } from "@/components/tracker/StatusHighlightCard";
import ExportDataButton from "@/components/tracker/ExportDataButton";
import { GoalProgress } from "@/components/tracker/GoalProgress";
import { WeeklySummary } from "@/components/tracker/WeeklySummary";
import { DateFilter } from "@/components/tracker/DateFilter";
import { GoalSettingCard } from "@/components/tracker/GoalSettingCard";

export const dynamic = "force-dynamic";

export default async function TrackerPage({
  searchParams,
}: {
  searchParams?: {
    filter?: string;
  };
}) {
  const dateFilter = searchParams?.filter;
  const session = await auth();
  
  const [entries, generalRecommendation, personalizedInsights] = await Promise.all([
    getTrackerEntries(dateFilter),
    getAnalysisRecommendation(),
    getPersonalizedInsights(),
  ]);

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-8">

        {/* Header Dashboard */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Selamat datang, {session?.user?.name || 'Pengguna'}!</p>
          </div>
          <Link href="/tracker/new">
            <Button size="lg" className="w-full sm:w-auto">
              <PlusCircle className="w-5 h-5 mr-2" />
              Tambah Catatan Baru
            </Button>
          </Link>
        </div>

        {/* Tampilan jika belum ada data */}
        {entries.length === 0 && (
          <Card className="flex flex-col items-center justify-center text-center p-12 min-h-[400px]">
              <CardTitle className="text-2xl font-semibold">Mulai Perjalanan Kesehatan Anda</CardTitle>
              <CardDescription className="mt-2 max-w-md">
                  Anda belum memiliki catatan apapun. Klik tombol di bawah untuk mulai mencatat dan melihat analisis kesehatan Anda.
              </CardDescription>
              <Link href="/tracker/new" className="mt-6">
                  <Button size="lg">Catat Data Pertama Anda</Button>
              </Link>
          </Card>
        )}

        {/* Tampilan jika sudah ada data */}
        {entries.length > 0 && (
          <>
            {/* Bagian Atas: Grafik dan Kartu Sorotan */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BarChart className="w-5 h-5" />Grafik Gula Darah</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TrackerChart data={entries} />
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-8">
                <Suspense fallback={<Card><CardContent><p className="p-4 text-sm text-muted-foreground">Memuat status...</p></CardContent></Card>}>
                  <StatusHighlightCard entries={entries} />
                </Suspense>
                <Suspense fallback={<Card><CardContent><p className="p-4 text-sm text-muted-foreground">Memuat progress...</p></CardContent></Card>}>
                  <GoalProgress entries={entries} />
                </Suspense>
              </div>
            </div>

            {/* Bagian Tengah: Wawasan, Ringkasan, dan Atur Target */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <Suspense fallback={<Card><CardContent><p className="p-4 text-sm text-muted-foreground">Memuat ringkasan...</p></CardContent></Card>}>
                  <WeeklySummary />
                </Suspense>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      Analisis & Rekomendasi
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    {personalizedInsights.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Pola Pribadi Anda:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                          {personalizedInsights.map((insight, index) => (
                            <li key={index} dangerouslySetInnerHTML={{ __html: insight.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                          ))}
                        </ul>
                      </div>
                    )}
                    {generalRecommendation && (
                      <div className={personalizedInsights.length > 0 ? "pt-4 border-t" : ""}>
                        <h4 className="font-semibold mb-2">Rekomendasi Umum:</h4>
                        <p className="font-semibold text-primary">{generalRecommendation.title}</p>
                        <p className="text-muted-foreground">{generalRecommendation.description}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                <GoalSettingCard />
            </div>

            {/* Bagian Bawah: Riwayat Detail */}
            <Card>
              <CardHeader>
                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-2"><History className="w-5 h-5" />Riwayat Konsumsi</CardTitle>
                        <CardDescription>Lihat dan kelola semua catatan Anda.</CardDescription>
                    </div>
                    <DateFilter />
                </div>
              </CardHeader>
              <CardContent>
                <ExportDataButton entries={entries} />
                <div className="border rounded-lg overflow-x-auto mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Makanan</TableHead>
                        <TableHead>Gula (mg/dL)</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Mood</TableHead>
                        <TableHead>Aktivitas</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                        {entries.map((entry: GlucoseEntry) => (
                          <TableRow key={entry.id}>
                            <TableCell className="font-medium text-xs whitespace-nowrap">
                              {new Date(entry.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })}
                              <br/>
                              <span className="text-muted-foreground">{new Date(entry.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</span>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground break-words max-w-[200px]">
                              {entry.food_name}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">{entry.sugar_g.toFixed(0)}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                  entry.status === "Tinggi" ? "bg-red-100 text-red-800"
                                  : entry.status === "Normal" ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {entry.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">{entry.mood || '-'}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{entry.activity || '-'}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <EditEntryDialog entry={entry} />
                                <DeleteEntryButton id={entry.id} />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </>
  );
}
