// app/admin/recommendations/page.tsx
import { getRecommendations } from '@/lib/actions/recommendationActions';
import { CreateRecommendationForm } from './CreateRecommendationForm';
import RecommendationList from './RecommendationList'; // <-- Impor komponen baru

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

      {/* Gunakan Client Component di sini dan kirim data sebagai props */}
      <RecommendationList recommendations={recommendations} />
    </div>
  );
}