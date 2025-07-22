// app/admin/recommendations/page.tsx
import { getRecommendations } from '@/lib/actions/recommendationActions';
import { EditRecommendationDialog } from './EditRecommendationDialog';
import { DeleteRecommendationButton } from './DeleteRecommendationButton';
import { CreateRecommendationForm } from './CreateRecommendationForm';

export default async function AdminRecommendationsPage() {
  const recommendations = await getRecommendations();

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Kelola Rekomendasi Analisis</h1>
        <p className="text-muted-foreground">
          Tambah, edit, atau hapus rekomendasi yang akan ditampilkan kepada pengguna berdasarkan status gula darah mereka.
        </p>
      </div>

      <CreateRecommendationForm />

      <div className="space-y-4 mt-8">
        <h2 className="text-2xl font-semibold mb-4">
          Daftar Rekomendasi ({recommendations.length})
        </h2>
        {recommendations.map((rec) => (
            <div key={rec.id} className="p-6 border rounded-lg bg-card flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-4">
                    <h3 className="font-bold text-lg">{rec.title}</h3>
                    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                        rec.category === 'Tinggi' ? 'bg-red-100 text-red-800' : 
                        rec.category === 'Normal' ? 'bg-green-100 text-green-800' : 
                        'bg-blue-100 text-blue-800'
                    }`}>
                      {rec.category}
                    </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">{rec.description}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 self-end sm:self-start">
                <EditRecommendationDialog recommendation={rec} />
                <DeleteRecommendationButton id={rec.id} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}