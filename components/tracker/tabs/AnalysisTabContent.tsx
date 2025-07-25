// components/tracker/tabs/AnalysisTabContent.tsx
import { getAnalysisRecommendation, getPersonalizedInsights } from '@/lib/actions/recommendationActions';
import { Lightbulb, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils'; // Import cn utility

export async function AnalysisTabContent() {
    const [personalizedInsights, generalRecommendations] = await Promise.all([
        getPersonalizedInsights(),
        getAnalysisRecommendation()
    ]);

    // Objek untuk memetakan kategori ke kelas CSS Tailwind
    const categoryStyles = {
      Tinggi: {
        card: "bg-red-50 border-red-200",
        title: "text-red-800",
        description: "text-red-700",
        icon: "text-red-500"
      },
      Normal: {
        card: "bg-green-50 border-green-200",
        title: "text-green-800",
        description: "text-green-700",
        icon: "text-green-500"
      },
      Rendah: {
        card: "bg-blue-50 border-blue-200",
        title: "text-blue-800",
        description: "text-blue-700",
        icon: "text-blue-500"
      },
    };

  return (
    <div className="space-y-6 mt-5">
       {personalizedInsights.length > 0 && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="flex items-center gap-2 font-semibold mb-2 text-blue-800">
              <Sparkles className="w-5 h-5" />
              Pola Pribadi Anda
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-blue-700">
              {personalizedInsights.map((insight, index) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: insight.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              ))}
            </ul>
          </div>
        )}

        {generalRecommendations.length > 0 && (
          <div className="space-y-4">
            {/* Judul dibuat netral */}
            <h4 className="flex items-center gap-2 font-semibold text-foreground">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Rekomendasi Umum
            </h4>
            {generalRecommendations.map((rec) => {
              // Ambil style berdasarkan kategori, atau default ke 'Normal' jika tidak ditemukan
              const styles = categoryStyles[rec.category as keyof typeof categoryStyles] || categoryStyles.Normal;
              return (
                <div key={rec.id} className={cn("p-4 border rounded-lg", styles.card)}>
                  <p className={cn("font-semibold", styles.title)}>{rec.title}</p>
                  <p className={cn("text-sm mt-1", styles.description)}>{rec.description}</p>
                </div>
              )
            })}
          </div>
        )}
        
        {!personalizedInsights.length && generalRecommendations.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
                Data belum cukup untuk analisis.
            </p>
        )}
    </div>
  );
}