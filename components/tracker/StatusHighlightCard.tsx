// components/tracker/StatusHighlightCard.tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, CheckCircle2 } from 'lucide-react';
import type { GlucoseEntry } from '@/lib/actions/trackerActions';

interface StatusHighlightCardProps {
  lastEntry: GlucoseEntry | undefined;
}

export function StatusHighlightCard({ lastEntry }: StatusHighlightCardProps) {
  if (!lastEntry) {
    return (
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>Selamat Datang!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Anda belum memiliki catatan. Mulai lacak konsumsi makanan Anda untuk melihat analisis kesehatan.
          </p>
        </CardContent>
      </Card>
    );
  }

  const statusConfig = {
    Tinggi: {
      Icon: TrendingUp,
      color: 'text-destructive',
      bgColor: 'bg-destructive/5',
      borderColor: 'border-destructive/20',
      message: 'Gula Darah Terakhir: Tinggi',
    },
    Normal: {
      Icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-500/5',
      borderColor: 'border-green-500/20',
      message: 'Gula Darah Terakhir: Normal',
    },
    Rendah: {
      Icon: TrendingDown,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/5',
      borderColor: 'border-blue-500/20',
      message: 'Gula Darah Terakhir: Rendah',
    },
  };

  const config = statusConfig[lastEntry.status];

  return (
    <Card className={cn(
        "transition-all gap-1", // <-- UBAH gap-6 (default) menjadi gap-1
        config.bgColor, 
        config.borderColor
    )}>
      {/* --- UBAH className DI BAWAH INI --- */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0"> {/* <-- UBAH pb-2 menjadi pb-0 */}
        <CardTitle className="text-sm font-medium">{config.message}</CardTitle>
        <config.Icon className={cn("h-5 w-5", config.color)} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">
          {lastEntry.sugar_g.toFixed(0)} <span className="text-lg text-muted-foreground">mg/dL</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Dicatat pada {new Date(lastEntry.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
        </p>
      </CardContent>
    </Card>
  );

}