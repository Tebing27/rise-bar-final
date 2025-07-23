// app/(main)/reports/page.tsx
import { getReportData } from '@/lib/actions/reportActions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle, TrendingDown, TrendingUp, PieChart, ListChecks } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function ReportsPage() {
  const reportData = await getReportData();

  if (!reportData) {
    return (
      <div className="container mx-auto max-w-4xl py-10 px-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Laporan & Wawasan</h1>
        <Card className="mt-8 flex flex-col items-center justify-center p-12 min-h-[300px]">
          <CardTitle className="text-xl">Data Belum Cukup</CardTitle>
          <CardDescription className="mt-2 max-w-md">
            Belum ada cukup data untuk membuat laporan. Mulai catat konsumsi harian Anda untuk melihat wawasan di sini.
          </CardDescription>
          <Link href="/tracker/new" className="mt-6">
            <Button>Tambah Catatan</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const { totalEntries, overallAverage, highestGlucose, lowestGlucose, statusDistribution, topTriggerFoods } = reportData;

  return (
    <div className="container mx-auto max-w-4xl py-10 px-4">
      <h1 className="text-3xl font-bold tracking-tight">Laporan & Wawasan</h1>
      <p className="text-muted-foreground mt-2">Analisis mendalam dari semua data yang telah Anda catat.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {/* Ringkasan Umum */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium text-muted-foreground">Total Catatan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalEntries}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium text-muted-foreground">Rata-rata Gula</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{overallAverage.toFixed(0)} <span className="text-lg text-muted-foreground">mg/dL</span></p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-medium text-muted-foreground"><PieChart className="w-4 h-4" /> Distribusi Status</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p><strong>Tinggi:</strong> {statusDistribution.tinggi} kali</p>
            <p><strong>Normal:</strong> {statusDistribution.normal} kali</p>
            <p><strong>Rendah:</strong> {statusDistribution.rendah} kali</p>
          </CardContent>
        </Card>
        
        {/* Poin Ekstrem */}
        {highestGlucose && (
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-medium text-muted-foreground"><TrendingUp className="w-4 h-4 text-red-500" /> Gula Tertinggi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{highestGlucose.value.toFixed(0)} <span className="text-base text-muted-foreground">mg/dL</span></p>
              <p className="text-xs text-muted-foreground mt-1">Pada {new Date(highestGlucose.date).toLocaleDateString('id-ID', {day: 'numeric', month: 'long'})}</p>
            </CardContent>
          </Card>
        )}
        {lowestGlucose && (
           <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-medium text-muted-foreground"><TrendingDown className="w-4 h-4 text-blue-500" /> Gula Terendah</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{lowestGlucose.value.toFixed(0)} <span className="text-base text-muted-foreground">mg/dL</span></p>
              <p className="text-xs text-muted-foreground mt-1">Pada {new Date(lowestGlucose.date).toLocaleDateString('id-ID', {day: 'numeric', month: 'long'})}</p>
            </CardContent>
          </Card>
        )}

        {/* Makanan Pemicu */}
        {topTriggerFoods.length > 0 && (
          <Card className="md:col-span-3 lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-medium text-muted-foreground"><AlertTriangle className="w-4 h-4 text-yellow-600" /> Pemicu Gula Tinggi</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {topTriggerFoods.map(item => (
                  <li key={item.food} className="flex justify-between text-sm">
                    <span>{item.food}</span>
                    <span className="font-semibold">{item.count}x</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
