// components/tracker/GoalProgress.tsx
import { getActiveUserGoals, type UserGoal } from '@/lib/actions/goalActions';
import { type GlucoseEntry } from '@/lib/actions/trackerActions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Target } from 'lucide-react';

// Fungsi helper untuk menghitung statistik dari entri
function calculateStats(entries: GlucoseEntry[]) {
  if (entries.length === 0) {
    return { average: 0, max: 0 };
  }
  const totalSugar = entries.reduce((sum, entry) => sum + entry.sugar_g, 0);
  const maxSugar = Math.max(...entries.map(entry => entry.sugar_g));
  return {
    average: totalSugar / entries.length,
    max: maxSugar,
  };
}

export async function GoalProgress({ entries }: { entries: GlucoseEntry[] }) {
  const goals = await getActiveUserGoals();
  const stats = calculateStats(entries);

  if (goals.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Target className="w-5 h-5" /> Target & Progress</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">Anda belum mengatur target. Atur target Anda di bawah untuk memulai!</p>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Target className="w-5 h-5" /> Target & Progress</CardTitle>
        <CardDescription>Lihat progress Anda terhadap target yang telah ditetapkan.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map(goal => {
            let currentValue = 0;
            let progress = 0;
            let label = '';
            let unit = 'mg/dL';
            
            if (goal.target_type === 'average_glucose') {
                currentValue = stats.average;
                // Progress: seberapa dekat nilai saat ini dengan target, dari 0.
                // Jika sudah mencapai atau lebih baik (lebih rendah), progress 100%.
                progress = currentValue > 0 ? Math.min(100, (goal.target_value / currentValue) * 100) : 0;
                label = 'Rata-rata Gula';
            } else if (goal.target_type === 'max_glucose') {
                currentValue = stats.max;
                progress = currentValue > 0 ? Math.min(100, (goal.target_value / currentValue) * 100) : 0;
                label = 'Gula Maksimal';
            }

            return (
                <div key={goal.id}>
                    <div className="flex justify-between items-baseline mb-1">
                        <span className="text-sm font-medium">{label}</span>
                        <span className="text-xs text-muted-foreground">Target: &lt; {goal.target_value} {unit}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                        <div 
                            className={`h-2.5 rounded-full ${progress >= 100 ? 'bg-green-500' : 'bg-primary'}`}
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                     <p className="text-right text-sm mt-1">Saat ini: <strong>{currentValue.toFixed(0)} {unit}</strong></p>
                </div>
            )
        })}
      </CardContent>
    </Card>
  );
}
