// components/tracker/tabs/GoalsTabs.tsx

import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GoalSettingCard } from "@/components/tracker/GoalSettingCard";
import { GoalProgress } from "@/components/tracker/GoalProgress";
import { type GlucoseEntry } from "@/lib/actions/trackerActions";

interface GoalsTabsProps {
  entries: GlucoseEntry[];
}

export function GoalsTabs({ entries }: GoalsTabsProps) {
  return (
    <Card>
        <Tabs defaultValue="progress">
            <CardHeader>
                <CardTitle>Target Anda</CardTitle>
                <CardDescription>Atur dan pantau target kesehatan Anda.</CardDescription>
                <TabsList className="mt-4">
                    <TabsTrigger value="progress">Progress</TabsTrigger>
                    <TabsTrigger value="settings">Pengaturan</TabsTrigger>
                </TabsList>
            </CardHeader>
            <TabsContent value="progress">
                <CardContent>
                    <Suspense fallback={<p>Memuat...</p>}>
                        <GoalProgress entries={entries} />
                    </Suspense>
                </CardContent>
            </TabsContent>
            <TabsContent value="settings">
                <CardContent>
                    <GoalSettingCard />
                </CardContent>
            </TabsContent>
      </Tabs>
    </Card>
  );
}