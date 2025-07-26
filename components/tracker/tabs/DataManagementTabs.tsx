// components/tracker/tabs/DataManagementTabs.tsx

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import TrackerForm from "@/components/tracker/TrackerForm";
import { HistoryTab } from "@/components/tracker/HistoryTab";
import { ReportTab } from "@/components/tracker/tabs/ReportTab";
import TrackerChart from "@/components/tracker/TrackerChart";
import { type GlucoseEntry } from "@/lib/actions/trackerActions";
import { CustomLegend } from "./CustomLegend"; // <-- Impor legenda baru

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

      {/* --- PERBAIKAN TATA LETAK DI SINI --- */}
      <CardContent className="space-y-4">
        <TrackerChart data={entries} />
        <CustomLegend />
      </CardContent>
      {/* ------------------------------------ */}

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
          <ReportTab />
        </TabsContent>
      </Tabs>
    </Card>
  );
}