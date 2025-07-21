import { getTrackerEntries, GlucoseEntry } from '@/lib/actions/trackerActions';
import TrackerForm from '@/components/tracker/TrackerForm';
import { DeleteEntryButton } from '@/components/tracker/DeleteEntryButton';
// import ExportButton from '@/components/tracker/ExportDataButton';
import TrackerChart from '@/components/tracker/TrackerChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function TrackerPage() {
  const entries: GlucoseEntry[] = await getTrackerEntries();

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Kolom Kiri: Form Input */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Catat Konsumsi Makanan</CardTitle>
            </CardHeader>
            <CardContent>
              <TrackerForm />
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Chart dan Riwayat */}
        <div className="lg:col-span-2 space-y-8">
          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Grafik Gula Darah (Simulasi)</CardTitle>
            </CardHeader>
            <CardContent>
              {entries && entries.length > 0 ? (
                <TrackerChart data={entries} />
              ) : (
                <div className="flex items-center justify-center h-80 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Data belum tersedia untuk ditampilkan di grafik.</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Riwayat */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Riwayat Konsumsi</CardTitle>
              {/* <ExportButton entries={entries} /> */}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {entries && entries.length > 0 ? (
                  entries.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-800">{entry.food_name}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(entry.created_at).toLocaleString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                           {' - '}
                          <span className="italic">{entry.condition}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-medium text-gray-700">{entry.sugar_g}g</span>
                        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                          entry.status === 'Tinggi' 
                            ? 'bg-red-100 text-red-800' 
                            : entry.status === 'Normal' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {entry.status}
                        </span>
                        <DeleteEntryButton id={entry.id} />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">Belum ada riwayat konsumsi.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
