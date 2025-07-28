// components/tracker/tabs/DataManagementTabs.tsx
'use client'

import dynamic from 'next/dynamic'; // <-- 1. Impor 'dynamic'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HistoryTab } from "@/components/tracker/HistoryTab";
import { ReportTab } from "@/components/tracker/tabs/ReportTab";
import { type GlucoseEntry } from "@/lib/actions/trackerActions";
import { CustomLegend } from "./CustomLegend";
import { ChartSkeleton } from '../ChartSkeleton';

// ✅ 2. Buat komponen dinamis untuk Chart
const TrackerChart = dynamic(() => import("@/components/tracker/TrackerChart"), {
  loading: () => <ChartSkeleton />,
  ssr: false, // Chart tidak perlu dirender di server
});

// ✅ 3. Buat komponen dinamis untuk Form
const TrackerForm = dynamic(() => import("@/components/tracker/TrackerForm"), {
  loading: () => <div className="py-10 flex items-center justify-center"><p>Memuat form...</p></div>,
  ssr: false, // Form tidak perlu dirender di server
});


interface DataManagementTabsProps {
  entries: GlucoseEntry[];
}

export function DataManagementTabs({ entries }: DataManagementTabsProps) {
  return (
    <Card className="bg-green-50 dark:bg-green-900/20">
      <CardHeader>
        <CardTitle>Grafik Gula Darah</CardTitle>
        <CardDescription>Visualisasi tren kesehatan Anda.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* ✅ 4. Gunakan komponen chart yang sudah dinamis */}
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
            {/* ✅ 5. Gunakan komponen form yang sudah dinamis */}
            <TrackerForm />
          </CardContent>
        </TabsContent>
        <TabsContent value="history">
          <HistoryTab entries={entries} />
        </TabsContent>
        <TabsContent value="report">
          <ReportTab />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
