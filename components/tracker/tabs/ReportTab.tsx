// components/tracker/tabs/ReportTab.tsx
import { CardContent } from '@/components/ui/card';
import { AlertTriangle, PieChart } from 'lucide-react';
import { type ReportData } from '@/lib/actions/reportActions';

export function ReportTab({ reportData }: { reportData: ReportData | null }) {
  if (!reportData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Belum ada cukup data untuk membuat laporan.</p>
      </div>
    );
  }

  const { totalEntries, overallAverage, statusDistribution, topTriggerFoods } = reportData;

  return (
    <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-2 gap-4 text-center">
            <div>
                <p className="text-sm text-muted-foreground">Total Catatan</p>
                <p className="text-2xl font-bold">{totalEntries}</p>
            </div>
             <div>
                <p className="text-sm text-muted-foreground">Rata-rata Gula</p>
                <p className="text-2xl font-bold">{overallAverage.toFixed(0)} mg/dL</p>
            </div>
        </div>
        <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2"><PieChart className="w-4 h-4" /> Distribusi Status</h4>
            <div className="text-sm space-y-1 text-muted-foreground">
                <p><strong>Tinggi:</strong> {statusDistribution.tinggi} kali</p>
                <p><strong>Normal:</strong> {statusDistribution.normal} kali</p>
                <p><strong>Rendah:</strong> {statusDistribution.rendah} kali</p>
            </div>
        </div>
       {topTriggerFoods.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-yellow-500" /> Pemicu Gula Tinggi</h4>
            <ul className="space-y-1">
              {topTriggerFoods.map(item => (
                <li key={item.food} className="flex justify-between text-sm text-muted-foreground">
                  <span>{item.food}</span>
                  <span className="font-semibold">{item.count}x</span>
                </li>
              ))}
            </ul>
          </div>
        )}
    </CardContent>
  );
}