// app/admin/recommendations/page.tsx
import { getRecommendations } from '@/lib/actions/recommendationActions';
import { EditRecommendationDialog } from './EditRecommendationDialog';
import { DeleteRecommendationButton } from './DeleteRecommendationButton';
import { CreateRecommendationForm } from './CreateRecommendationForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default async function AdminRecommendationsPage() {
  const recommendations = await getRecommendations();

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Kelola Rekomendasi</h1>
        <p className="text-muted-foreground">
          Tambah atau edit rekomendasi yang ditampilkan di halaman analisis pengguna.
        </p>
      </div>

      <CreateRecommendationForm />

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
    </div>
  );
}