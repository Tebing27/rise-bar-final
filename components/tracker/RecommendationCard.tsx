// components/tracker/RecommendationCard.tsx
import { Lightbulb, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { type Recommendation } from '@/lib/actions/recommendationActions';
import Link from 'next/link';

interface RecommendationCardProps {
  generalRecommendation: Recommendation | null;
  personalizedInsights: string[];
}

export function RecommendationCard({ generalRecommendation, personalizedInsights }: RecommendationCardProps) {
  const hasContent = generalRecommendation || personalizedInsights.length > 0;

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Analisis & Rekomendasi
        </CardTitle>
        <CardDescription>Wawasan cerdas berdasarkan data Anda.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-center">
        {!hasContent ? (
          <p className="text-sm text-muted-foreground text-center">
            Catat lebih banyak data untuk mendapatkan rekomendasi yang dipersonalisasi.
          </p>
        ) : (
          <div className="space-y-4 text-sm">
            {personalizedInsights.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Pola Pribadi Anda:
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  {personalizedInsights.map((insight, index) => (
                    <li key={index} dangerouslySetInnerHTML={{ __html: insight.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  ))}
                </ul>
              </div>
            )}
            {generalRecommendation && (
              <div className={personalizedInsights.length > 0 ? "pt-4 border-t" : ""}>
                <h4 className="font-semibold mb-2">Rekomendasi Umum:</h4>
                <p className="font-semibold text-primary">{generalRecommendation.title}</p>
                <p className="text-muted-foreground">{generalRecommendation.description}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}