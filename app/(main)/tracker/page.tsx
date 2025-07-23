// app/(main)/tracker/page.tsx
import React, { Suspense } from "react";
import { getTrackerEntries, type GlucoseEntry } from "@/lib/actions/trackerActions";
import { getAnalysisRecommendation, getPersonalizedInsights } from "@/lib/actions/recommendationActions";
import TrackerForm from "@/components/tracker/TrackerForm";
import { DeleteEntryButton } from "@/components/tracker/DeleteEntryButton";
import EditEntryDialog from "@/components/tracker/EditEntryDialog";
import TrackerChart from "@/components/tracker/TrackerChart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Toaster } from "@/components/ui/sonner";
import { Lightbulb, BarChart, History, Target } from "lucide-react";
import { WeeklySummary } from "@/components/tracker/WeeklySummary";
import { TrackerActions } from "@/components/tracker/TrackerActions";
import { GoalProgress } from "@/components/tracker/GoalProgress";
import { GoalSettingCard } from "@/components/tracker/GoalSettingCard";
import { DateFilter } from "@/components/tracker/DateFilter";

export const dynamic = "force-dynamic";

export default async function TrackerPage({
  searchParams,
}: {
  searchParams?: {
    filter?: string;
  };
}) {
  const dateFilter = searchParams?.filter;

  const [entries, generalRecommendation, personalizedInsights] = await Promise.all([
    getTrackerEntries(dateFilter),
    getAnalysisRecommendation(),
    getPersonalizedInsights(),
  ]);

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="container mx-auto max-w-7xl py-10 px-4 sm:px-6 lg:px-8">
        {/* Wrapper utama untuk semua konten */}
        <div className="flex flex-col gap-8">

          {/* Bagian Atas: Grafik Gula Darah */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BarChart className="w-5 h-5" />Grafik Gula Darah (Simulasi)</CardTitle>
            </CardHeader>
            <CardContent>
              {entries && entries.length > 0 ? (
                <TrackerChart data={entries} />
              ) : (
                <div className="flex items-center justify-center h-80 bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground">Data belum tersedia untuk ditampilkan di grafik.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bagian Bawah: Grid 3 kolom untuk Desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* === KOLOM KIRI: Aksi Utama === */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Catat Konsumsi Makanan</CardTitle>
                  <CardDescription>Masukkan data untuk analisis.</CardDescription>
                </CardHeader>
                <CardContent>
                  <TrackerForm />
                </CardContent>
              </Card>
              <GoalSettingCard />
            </div>

            {/* === KOLOM TENGAH: Wawasan & Analisis === */}
            <div className="space-y-8">
               <Suspense fallback={<Card><CardContent><p className="p-4 text-sm text-muted-foreground">Memuat progress...</p></CardContent></Card>}>
                <GoalProgress entries={entries} />
              </Suspense>
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
                <CardContent className="space-y-4">
                  {personalizedInsights.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">Pola Pribadi Anda:</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                        {personalizedInsights.map((insight, index) => (
                          <li key={index} dangerouslySetInnerHTML={{ __html: insight.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                        ))}
                      </ul>
                    </div>
                  )}
                  {generalRecommendation ? (
                    <div className="space-y-2 pt-4 border-t">
                       <h4 className="text-sm font-semibold">Rekomendasi Umum:</h4>
                      <h3 className="font-semibold text-primary">
                        {generalRecommendation.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {generalRecommendation.description}
                      </p>
                    </div>
                  ) : (
                     <p className="pt-4 text-sm text-muted-foreground border-t">
                      Catat lebih banyak data untuk mendapatkan rekomendasi umum.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* === KOLOM KANAN: Riwayat Detail === */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                   <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                          <CardTitle className="flex items-center gap-2"><History className="w-5 h-5" />Riwayat Konsumsi</CardTitle>
                          <CardDescription>Lihat dan kelola catatan Anda.</CardDescription>
                      </div>
                      <DateFilter />
                  </div>
                </CardHeader>
                <CardContent>
                  <TrackerActions entries={entries} />
                  <div className="border rounded-lg overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tanggal</TableHead>
                          <TableHead>Makanan</TableHead>
                          <TableHead>Gula</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Mood</TableHead>
                          <TableHead>Aktivitas</TableHead>
                          <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {entries && entries.length > 0 ? (
                          entries.map((entry: GlucoseEntry) => (
                            <TableRow key={entry.id}>
                              <TableCell className="font-medium text-xs whitespace-nowrap">
                                {new Date(entry.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })}
                                <br/>
                                <span className="text-muted-foreground">{new Date(entry.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</span>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground break-words max-w-[150px]">
                                {entry.food_name}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">{entry.sugar_g.toFixed(0)} mg/dL</TableCell>
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
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                              Tidak ada riwayat untuk rentang waktu yang dipilih.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
