// lib/actions/reportActions.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { auth } from '@/lib/auth';
import { type GlucoseEntry } from './trackerActions';

// Menentukan struktur data yang akan kita tampilkan di laporan
export interface ReportData {
  totalEntries: number;
  overallAverage: number;
  highestGlucose: { value: number; date: string } | null;
  lowestGlucose: { value: number; date: string } | null;
  statusDistribution: {
    tinggi: number;
    normal: number;
    rendah: number;
  };
  topTriggerFoods: { food: string; count: number }[];
}

export async function getReportData(): Promise<ReportData | null> {
  const supabase = await createClient();
  const session = await auth();
  const user = session?.user;

  if (!user) return null;

  const { data: entries, error } = await supabase
    .from('glucose_entries')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error || !entries || entries.length === 0) {
    return null;
  }

  // 1. Statistik Dasar
  const totalEntries = entries.length;
  const totalSugar = entries.reduce((sum, entry) => sum + entry.sugar_g, 0);
  const overallAverage = totalSugar / totalEntries;

  const highestGlucose = entries.reduce((max, entry) => entry.sugar_g > max.sugar_g ? entry : max, entries[0]);
  const lowestGlucose = entries.reduce((min, entry) => entry.sugar_g < min.sugar_g ? entry : min, entries[0]);

  // 2. Distribusi Status
  const statusDistribution = entries.reduce((acc, entry) => {
    if (entry.status === 'Tinggi') acc.tinggi++;
    if (entry.status === 'Normal') acc.normal++;
    if (entry.status === 'Rendah') acc.rendah++;
    return acc;
  }, { tinggi: 0, normal: 0, rendah: 0 });

  // 3. Makanan Pemicu Teratas
  const highTriggerFoodsCount = entries
    .filter(e => e.status === 'Tinggi' && e.food_name)
    .flatMap(e => e.food_name.split(',').map((f: string) => f.trim().replace(/ \(\d+x\)$/, '')))
    .reduce<Record<string, number>>((acc, food) => {
      acc[food] = (acc[food] || 0) + 1;
      return acc;
    }, {});
  
  const topTriggerFoods = Object.entries(highTriggerFoodsCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([food, count]) => ({
      food,
      count: count as number
    }));

  return {
    totalEntries,
    overallAverage,
    highestGlucose: { value: highestGlucose.sugar_g, date: highestGlucose.created_at },
    lowestGlucose: { value: lowestGlucose.sugar_g, date: lowestGlucose.created_at },
    statusDistribution,
    topTriggerFoods,
  };
}