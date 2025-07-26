// lib/actions/gamificationActions.ts
'use server';
import { createClient } from '@/utils/supabase/server';
import { auth } from '@/lib/auth';

// Definisikan tipe untuk entri agar lebih aman
interface WeeklyEntry {
  created_at: string;
  status: 'Tinggi' | 'Normal' | 'Rendah';
  food_name: string;
}

export async function getWeeklySummary() {
  const supabase = await createClient();
  const session = await auth();
  if (!session?.user) return null;

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const { data, error } = await supabase
    .from('glucose_entries')
    .select('created_at, status, food_name')
    .eq('user_id', session.user.id)
    .gte('created_at', oneWeekAgo.toISOString());

  // Casting `data` ke tipe `WeeklyEntry[]`
  // Kita bisa asumsikan data tidak null jika tidak ada error
  if (error || !data) return null;
  const entries = data as WeeklyEntry[];


  // 1. Hitung hari aktif (untuk badge)
  const activeDays = new Set(entries.map(e => new Date(e.created_at).toDateString())).size;
  const consecutiveStreak = activeDays >= 5; // Badge jika aktif 5 dari 7 hari

  // 2. Analisis tren
  const statusCounts = entries.reduce((acc, entry) => {
      acc[entry.status] = (acc[entry.status] || 0) + 1;
      return acc;
  }, {} as Record<string, number>);

  // 3. Makanan pemicu 'Tinggi'
  const highTriggerFoods = entries
    .filter(e => e.status === 'Tinggi')
    .flatMap(e => e.food_name.split(',').map((f: string) => f.trim().replace(/ \(\d+x\)$/, '')))
    // ✅ Perbaikan: Definisikan tipe accumulator langsung di sini
    .reduce((acc: Record<string, number>, food: string) => {
        acc[food] = (acc[food] || 0) + 1;
        return acc;
    }, {}); // <-- Initial value adalah objek kosong

  const topTriggerFood = Object.entries(highTriggerFoods).sort((a, b) => b[1] - a[1])[0]?.[0];

  return {
    consecutiveStreak,
    activeDays,
    statusCounts,
    topTriggerFood
  };
}
