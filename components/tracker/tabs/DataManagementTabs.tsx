// components/tracker/tabs/DataManagementTabs.tsx
'use client'

import dynamic from 'next/dynamic';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HistoryTab } from "@/components/tracker/HistoryTab";
import { ReportTab } from "@/components/tracker/tabs/ReportTab";
import { type GlucoseEntry } from "@/lib/actions/trackerActions";
import { type ReportData } from "@/lib/actions/reportActions";
import { CustomLegend } from "./CustomLegend";
import { ChartSkeleton } from '../ChartSkeleton';

// Komponen dinamis untuk Chart
const TrackerChart = dynamic(() => import("@/components/tracker/TrackerChart"), {
  loading: () => <ChartSkeleton />, // Tampilkan skeleton saat grafik dimuat
  ssr: false, // Hanya muat di sisi klien
});

// Komponen dinamis untuk Form
const TrackerForm = dynamic(() => import("@/components/tracker/TrackerForm"), {
  loading: () => <div className="py-10 flex items-center justify-center"><p>Memuat form...</p></div>,
  ssr: false, // Hanya muat di sisi klien
});

interface DataManagementTabsProps {
  entries: GlucoseEntry[];
  reportData: ReportData | null;
}

export function DataManagementTabs({ entries, reportData }: DataManagementTabsProps) {
  return (
    <Card className="bg-green-50 dark:bg-green-900/20">
      <CardHeader>
        <CardTitle>Grafik Gula Darah</CardTitle>
        <CardDescription>Visualisasi tren kesehatan Anda.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <TrackerChart data={entries} />
        <CustomLegend />
      </CardContent>

      <Tabs defaultValue="history" className="pt-0">
        <CardContent>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="new">Catat</TabsTrigger>
            <TabsTrigger value="history">Riwayat</TabsTrigger>
            <TabsTrigger value="report">Laporan</TabsTrigger>
          </TabsList>
        </CardContent>
        <TabsContent value="new">
          <CardContent>
            <TrackerForm />
          </CardContent>
        </TabsContent>
        <TabsContent value="history">
          <HistoryTab entries={entries} />
        </TabsContent>
        <TabsContent value="report">
          {/* ✅ PERBAIKAN: Pastikan variabel 'reportData' yang diteruskan, bukan komponen 'ReportTab' */}
          <ReportTab reportData={reportData} />
        </TabsContent>
      </Tabs>
    </Card>
  );
}