// app/(main)/tracker/page.tsx
import { getTrackerEntries, GlucoseEntry } from '@/lib/actions/solutionActions'; // Change to solutionActions
import { getSolutions } from '@/lib/actions/solutionActions'; // Correct import for getSolutions
import TrackerForm from '@/components/tracker/TrackerForm';
import { DeleteEntryButton } from '@/components/tracker/DeleteEntryButton';
// 2. Pastikan nama file komponen Anda benar (ExportButton bukan ExportDataButton)
import ExportButton from '@/components/tracker/ExportDataButton'; 

// 3. Definisikan tipe untuk data 'solutions'
interface Solution {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

export default async function TrackerPage() {
  const entries: GlucoseEntry[] = await getTrackerEntries();
  const solutions: Solution[] = await getSolutions();

  const totalSugarToday = entries
    // 4. Tambahkan tipe data pada parameter
    .filter((entry: GlucoseEntry) => new Date(entry.created_at).toDateString() === new Date().toDateString())
    .reduce((acc: number, entry: GlucoseEntry) => acc + (entry.sugar_g || 0), 0);

  const recommendation = totalSugarToday > 50
    // 5. Tambahkan tipe data pada parameter
    ? solutions.find((s: Solution) => s.title.toLowerCase().includes('gula')) || (solutions.length > 0 ? solutions[0] : null)
    : null;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Tracker Gula Harian</h1>
      <TrackerForm />

      {recommendation && (
        <div className="my-8 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
          <h3 className="font-bold">Rekomendasi untuk Anda!</h3>
          <p>{recommendation.description}</p>
        </div>
      )}

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Riwayat Konsumsi</h2>
          <ExportButton entries={entries} />
        </div>
        <div className="space-y-3">
          {entries && entries.length > 0 ? (
            // 6. Tambahkan tipe data pada parameter
            entries.map((entry: GlucoseEntry) => (
              <div key={entry.id} className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm">
                <div className="flex flex-col">
                  <span className="font-semibold text-lg">{entry.food_name}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(entry.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-700">{entry.sugar_g || 0}g Gula</span>
                  <DeleteEntryButton id={entry.id} />
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">Belum ada riwayat konsumsi.</p>
          )}
        </div>
      </div>
    </div>
  );
}