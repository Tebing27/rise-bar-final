// app/(main)/tracker/page.tsx
import React from "react";
import { getTrackerEntries, GlucoseEntry } from "@/lib/actions/trackerActions";
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

export const dynamic = "force-dynamic";

export default async function TrackerPage() {
  const [entries, recommendation] = await Promise.all([
    getTrackerEntries(),
    getAnalysisRecommendation(),
  ]);

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="container mx-auto py-10 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Catat Konsumsi Makanan</CardTitle>
              </CardHeader>
              <CardContent>
                <TrackerForm />
              </CardContent>
            </Card>

            {/* Recommendation Card */}
            <Card className="mt-8">
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
                    Belum ada rekomendasi. Coba catat konsumsi makanan Anda
                    terlebih dahulu untuk melihat analisis.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Grafik Gula Darah (Simulasi)</CardTitle>
              </CardHeader>
              <CardContent>
                {entries && entries.length > 0 ? (
                  <TrackerChart data={entries} />
                ) : (
                  <div className="flex items-center justify-center h-80 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">
                      Data belum tersedia untuk ditampilkan di grafik.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Riwayat Konsumsi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {/* --- HEADER TABEL DIPERBARUI --- */}
                        <TableHead className="w-[15%]">Tanggal</TableHead>
                        <TableHead className="w-[10%]">Waktu</TableHead>{" "}
                        {/* <-- KOLOM WAKTU DITAMBAHKAN */}
                        <TableHead className="w-[25%]">Makanan</TableHead>
                        <TableHead>Gula Darah</TableHead>
                        <TableHead>Usia</TableHead>
                        <TableHead>Kondisi</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {entries && entries.length > 0 ? (
                        entries.map((entry) => (
                          <TableRow key={entry.id}>
                            {/* --- ISI TABEL DIPERBARUI --- */}
                            <TableCell className="font-medium">
                              {new Date(entry.created_at)
                                .toLocaleDateString("id-ID", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                })
                                .replace(/\//g, "-")}
                            </TableCell>
                            <TableCell>
                              {new Date(entry.created_at).toLocaleTimeString(
                                "id-ID",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                }
                              )}
                            </TableCell>{" "}
                            {/* <-- DATA WAKTU DI SINI */}
                            <TableCell className="text-sm text-gray-600 break-words">
                              {entry.food_name}
                            </TableCell>
                            <TableCell>
                              {entry.sugar_g.toFixed(0)} mg/dL
                            </TableCell>
                            <TableCell>{entry.age_at_input} tahun</TableCell>
                            <TableCell>{entry.condition}</TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                  entry.status === "Tinggi"
                                    ? "bg-red-100 text-red-800"
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
                          <TableCell
                            colSpan={8}
                            className="text-center text-gray-500 py-8"
                          >
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
