// app/(main)/tracker/page.tsx
import React from "react";
import { getTrackerEntries } from "@/lib/actions/trackerActions";
import { getAnalysisRecommendation } from "@/lib/actions/recommendationActions";
import TrackerForm from "@/components/tracker/TrackerForm";
import { DeleteEntryButton } from "@/components/tracker/DeleteEntryButton";
import EditEntryDialog from "@/components/tracker/EditEntryDialog";
import TrackerChart from "@/components/tracker/TrackerChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Toaster } from "@/components/ui/sonner";
import { Lightbulb } from "lucide-react";
import { StatusHighlightCard } from "@/components/tracker/StatusHighlightCard";
import { auth } from '@/lib/auth';

export const dynamic = "force-dynamic";

export default async function TrackerPage() {
  const [session, entries, recommendation] = await Promise.all([
    auth(),
    getTrackerEntries(),
    getAnalysisRecommendation(),
  ]);
  
  const userName = session?.user?.name?.split(' ')[0] || 'Pengguna';
  const lastEntry = entries?.[0];

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="container mx-auto py-10 px-4">
        
        {/* Header Dashboard */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold">Selamat Datang, {userName}!</h1>
            <p className="text-muted-foreground">Berikut adalah ringkasan kesehatan glukosa Anda.</p>
        </div>

        {/* Layout Grid Utama */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Kolom Kiri: Form & Rekomendasi */}
          <div className="lg:col-span-1 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Catat Konsumsi Baru</CardTitle>
              </CardHeader>
              <CardContent>
                <TrackerForm />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Rekomendasi Analisis
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recommendation ? (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-primary">
                      {recommendation.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {recommendation.description}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Catat konsumsi Anda untuk melihat rekomendasi cerdas di sini.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Kolom Kanan: Status, Grafik, dan Riwayat */}
          <div className="lg:col-span-2 space-y-8">
            
            <StatusHighlightCard lastEntry={lastEntry} />

            <Card>
              <CardHeader>
                <CardTitle>Grafik Gula Darah (Simulasi)</CardTitle>
              </CardHeader>
              <CardContent>
                {entries && entries.length > 0 ? (
                  <TrackerChart data={entries} />
                ) : (
                  <div className="flex items-center justify-center h-80 bg-muted/50 rounded-lg">
                    <p className="text-muted-foreground">
                      Data belum tersedia untuk ditampilkan di grafik.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Riwayat Konsumsi Terbaru</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Waktu</TableHead>
                        <TableHead>Makanan</TableHead>
                        <TableHead>Gula Darah</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {entries && entries.length > 0 ? (
                        entries.slice(0, 5).map((entry) => ( // Hanya tampilkan 5 teratas
                          <TableRow key={entry.id}>
                            <TableCell className="font-medium">
                              {new Date(entry.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}
                               <br />
                               <span className="text-xs text-muted-foreground">
                               {new Date(entry.created_at).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                               </span>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground break-words max-w-xs">{entry.food_name}</TableCell>
                            <TableCell>{entry.sugar_g.toFixed(0)} mg/dL</TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                  entry.status === "Tinggi"
                                    ? "bg-destructive/10 text-destructive"
                                    : entry.status === "Normal"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {entry.status}
                              </span>
                            </TableCell>
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
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                            Belum ada riwayat konsumsi.
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
    </>
  );
}