// components/tracker/tabs/AnalysisTabContent.tsx
import { getAnalysisRecommendation, getPersonalizedInsights } from '@/lib/actions/recommendationActions';
import { Lightbulb, Sparkles } from 'lucide-react';
import { type Recommendation } from '@/lib/actions/recommendationActions';

export async function AnalysisTabContent() {
    const [personalizedInsights, generalRecommendation] = await Promise.all([
        getPersonalizedInsights(),
        getAnalysisRecommendation()
    ]);

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
        {generalRecommendation && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg mt-5">
            <h4 className="flex items-center gap-2 font-semibold mb-2 text-green-800">
              <Lightbulb className="w-5 h-5" />
              Rekomendasi Umum
            </h4>
            <p className="font-semibold text-primary">{generalRecommendation.title}</p>
            <p className="text-sm text-muted-foreground">{generalRecommendation.description}</p>
          </div>
        )}
        {!personalizedInsights.length && !generalRecommendation && (
            <p className="text-sm text-muted-foreground text-center py-8">
                Data belum cukup untuk analisis.
            </p>
        )}
    </div>
  );
}