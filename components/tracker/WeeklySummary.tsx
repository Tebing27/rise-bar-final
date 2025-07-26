// components/tracker/WeeklySummary.tsx
import { getWeeklySummary } from '@/lib/actions/gamificationActions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';
import Image from 'next/image'; // <-- 1. Import Image

export async function WeeklySummary() {
  const summary = await getWeeklySummary();

  if (!summary) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Ringkasan 7 Hari Terakhir</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">Belum ada data yang cukup untuk ditampilkan. Catat data Anda selama seminggu untuk melihat ringkasan.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className='mt-5'>
      <CardHeader>
        <CardTitle>Ringkasan 7 Hari Terakhir</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* --- 2. Tambahkan div pembungkus dan gambar --- */}
        <div className="flex items-start gap-4">
          <Image 
            src="/mascot_berjelajah.png"
            alt="Mascot Berjelajah"
            width={80}
            height={80}
            className="hidden sm:block mt-2"
          />
          <div className="flex-1 space-y-4">
            {summary.consecutiveStreak && (
              <div className="flex items-center gap-3 p-3 bg-green-50 text-green-800 rounded-lg border border-green-200">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-semibold">Hebat! Anda aktif mencatat data selama {summary.activeDays} hari dalam seminggu terakhir!</p>
              </div>
            )}
            <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Tren Status Gula:</h4>
                <div className="flex gap-4 text-sm text-muted-foreground">
                    <p>Tinggi: <strong>{summary.statusCounts['Tinggi'] || 0}x</strong></p>
                    <p>Normal: <strong>{summary.statusCounts['Normal'] || 0}x</strong></p>
                    <p>Rendah: <strong>{summary.statusCounts['Rendah'] || 0}x</strong></p>
                </div>
            </div>
            {summary.topTriggerFood && (
              <div className="flex items-start gap-3 p-3 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200">
                <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  <span className="font-semibold">Makanan Pemicu:</span> Tampaknya <strong>{summary.topTriggerFood}</strong> paling sering muncul saat kadar gula Anda tinggi minggu ini.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}