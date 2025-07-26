// app/admin/recommendations/RecommendationList.tsx
'use client'; // <-- Jadikan ini Client Component

import dynamic from 'next/dynamic';
import { type Recommendation } from '@/lib/actions/recommendationActions';
import { DeleteRecommendationButton } from './DeleteRecommendationButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

// Pindahkan dynamic import ke sini
const EditRecommendationDialog = dynamic(() =>
  import('./EditRecommendationDialog').then((mod) => mod.EditRecommendationDialog), {
  loading: () => (
    <Button variant="outline" size="sm" disabled>
      <Pencil className="w-3 h-3 mr-1" />
      Memuat...
    </Button>
  ),
  ssr: false,
});

export default function RecommendationList({ recommendations }: { recommendations: Recommendation[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Rekomendasi ({recommendations.length})</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {recommendations.map((rec) => (
          <div key={rec.id} className="p-4 border rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-4">
                  <h3 className="font-semibold text-base">{rec.title}</h3>
                  <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      rec.category === 'Tinggi' ? 'bg-red-100 text-red-800' :
                      rec.category === 'Normal' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                  }`}>
                    {rec.category}
                  </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{rec.description}</p>
            </div>
            <div className="flex gap-2 self-end sm:self-start flex-shrink-0">
              <EditRecommendationDialog recommendation={rec} />
              <DeleteRecommendationButton id={rec.id} />
            </div>
          </div>
        ))}
         {recommendations.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Belum ada rekomendasi yang dibuat.
            </div>
          )}
      </CardContent>
    </Card>
  );
}