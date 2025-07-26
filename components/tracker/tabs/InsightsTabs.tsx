// components/tracker/tabs/InsightsTabs.tsx

import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatusHighlightCard } from "@/components/tracker/StatusHighlightCard";
import { WeeklySummary } from "@/components/tracker/WeeklySummary";
import { AnalysisTabContent } from "@/components/tracker/tabs/AnalysisTabContent"; // Komponen baru
import { type GlucoseEntry } from "@/lib/actions/trackerActions";

interface InsightsTabsProps {
  entries: GlucoseEntry[];
}

export function InsightsTabs({ entries }: InsightsTabsProps) {
  return (
    <Card className="bg-yellow-50 dark:bg-yellow-900/20">
      <Tabs defaultValue="highlight">
        <CardHeader>
            <CardTitle>Wawasan & Analisis</CardTitle>
            <CardDescription>Pahami data Anda lebih dalam.</CardDescription>
            <TabsList className="mt-4">
                <TabsTrigger value="highlight">Terkini</TabsTrigger>
                <TabsTrigger value="weekly">Mingguan</TabsTrigger>
                <TabsTrigger value="analysis">Analisis</TabsTrigger>
            </TabsList>
        </CardHeader>
        <TabsContent value="highlight">
            <CardContent>
                <Suspense fallback={<p>Memuat...</p>}>
                    <StatusHighlightCard entries={entries} />
                </Suspense>
            </CardContent>
        </TabsContent>
        <TabsContent value="weekly">
             <CardContent>
                <Suspense fallback={<p>Memuat...</p>}>
                    <WeeklySummary />
                </Suspense>
            </CardContent>
        </TabsContent>
        <TabsContent value="analysis">
             <CardContent>
                <Suspense fallback={<p>Memuat...</p>}>
                    <AnalysisTabContent />
                </Suspense>
            </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
}