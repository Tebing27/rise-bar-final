// components/tracker/StatusHighlightCard.tsx
import { type GlucoseEntry } from '@/lib/actions/trackerActions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, CheckCircle, Activity } from 'lucide-react';

interface StatusHighlightCardProps {
  entries: GlucoseEntry[];
}

export function StatusHighlightCard({ entries }: StatusHighlightCardProps) {
  if (!entries || entries.length === 0) {
    return null;
  }

  const latestEntry = entries[0];
  const average = entries.reduce((sum, entry) => sum + entry.sugar_g, 0) / entries.length;
  
  const statusIcon = {
    'Tinggi': <TrendingUp className="h-6 w-6 text-red-500" />,
    'Normal': <CheckCircle className="h-6 w-6 text-green-500" />,
    'Rendah': <TrendingDown className="h-6 w-6 text-blue-500" />,
  }[latestEntry.status];

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow mt-5">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Sorotan Terkini</CardTitle>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
            <div className="text-3xl font-bold">{latestEntry.sugar_g.toFixed(0)} mg/dL</div>
            <p className="text-xs text-muted-foreground flex items-center">
                {statusIcon}
                <span className="ml-1">Status terakhir Anda: <strong>{latestEntry.status}</strong></span>
            </p>
        </div>
        <div>
            <p className="text-xs text-muted-foreground">Rata-rata Keseluruhan</p>
            <p className="text-lg font-semibold">{average.toFixed(0)} mg/dL</p>
        </div>
      </CardContent>
    </Card>
  );
}