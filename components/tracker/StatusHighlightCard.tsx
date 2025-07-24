// components/tracker/StatusHighlightCard.tsx
import { type GlucoseEntry } from '@/lib/actions/trackerActions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, CheckCircle } from 'lucide-react';

// ✅ PERBAIKAN: Tambahkan interface untuk props
interface StatusHighlightCardProps {
  entries: GlucoseEntry[];
}

export function StatusHighlightCard({ entries }: StatusHighlightCardProps) {
  if (!entries || entries.length === 0) {
    return null;
  }

  const latestEntry = entries[0];
  const average = entries.reduce((sum, entry) => sum + entry.sugar_g, 0) / entries.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sorotan Terkini</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Catatan Terakhir</p>
          <p className="text-2xl font-bold">{latestEntry.sugar_g.toFixed(0)} mg/dL</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Rata-rata</p>
          <p className="text-2xl font-bold">{average.toFixed(0)} mg/dL</p>
        </div>
      </CardContent>
    </Card>
  );
}
