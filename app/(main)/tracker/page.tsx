// app/(main)/tracker/page.tsx
import { auth } from '@/lib/auth';
import { db } from '@/lib/supabase';
import { TrackerForm } from '@/components/tracker/TrackerForm';

// Fungsi untuk mengambil data makanan dari database
async function getFoodEntries() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const { data, error } = await db
    .from('glucose_entries')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false }) // Tampilkan yang terbaru di atas
    .limit(10); // Batasi 10 entri terbaru

  if (error) {
    console.error('Error fetching entries:', error);
    return [];
  }
  return data;
}

export default async function TrackerPage() {
  const entries = await getFoodEntries();
  const totalCarbs = entries.reduce((sum, entry) => sum + (Number(entry.estimated_carbs_g) || 0), 0);

  return (
    <div className="mx-auto max-w-4xl py-8 px-4">
         <h1 className="text-3xl font-bold mb-6">Glucose Tracker</h1>
            
     {/* Ganti form lama dengan komponen baru */}
         <TrackerForm />
      
      {/* Daftar riwayat makanan */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Riwayat Hari Ini</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {entries.map((entry) => (
              <li key={entry.id} className="px-6 py-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">{entry.food_name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(entry.created_at).toLocaleTimeString()}
                  </p>
                </div>
                <p className="text-lg font-medium">{entry.estimated_carbs_g}g Carbs</p>
              </li>
            ))}
            {entries.length === 0 && <p className="p-6 text-gray-500">Belum ada data hari ini.</p>}
          </ul>
          <div className="bg-gray-50 px-6 py-3 font-bold text-right">
            Total Karbohidrat: {totalCarbs.toFixed(2)}g
          </div>
        </div>
      </div>
    </div>
  );
}