// app/(main)/tracker/page.tsx
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin'; // Ganti ke supabaseAdmin
import { TrackerForm } from '@/components/tracker/TrackerForm';
import { redirect } from 'next/navigation';

async function getFoodEntries(userId: string) {
  console.log('🔍 DEBUG: getFoodEntries called with userId:', userId);
  
  const { data, error } = await supabaseAdmin // Gunakan supabaseAdmin
    .from('glucose_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);
  
  console.log('🔍 DEBUG: Query result:', { data, error });
  console.log('🔍 DEBUG: Number of entries found:', data?.length || 0);
  
  return error ? [] : data;
}

async function getSolutions() {
  const { data, error } = await supabaseAdmin.from('solutions').select('*');
  return error ? [] : data;
}

export default async function TrackerPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/login');
  }
  const userId = session.user.id;
  
  console.log('🔍 DEBUG: TrackerPage userId:', userId);

  const [entries, solutions] = await Promise.all([
    getFoodEntries(userId),
    getSolutions()
  ]);

  console.log('🔍 DEBUG: Final entries:', entries);

  const totalCarbs = entries.reduce((sum, entry) => sum + (Number(entry.estimated_carbs_g) || 0), 0);

  let currentRange = '';
  if (totalCarbs <= 40) currentRange = 'Rendah';
  else if (totalCarbs <= 100) currentRange = 'Normal';
  else currentRange = 'Tinggi';
  
  const relevantSolution = solutions.find(
    (s) => s.glucose_range.toLowerCase() === currentRange.toLowerCase()
  );

  return (
    <div className="mx-auto max-w-4xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Glucose Tracker</h1>
      
      <TrackerForm userId={userId} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Riwayat Hari Ini</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {entries.map((entry) => (
                <li key={entry.id} className="px-6 py-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800">{entry.food_name}</p>
                    <p className="text-sm text-gray-500">{new Date(entry.created_at).toLocaleTimeString()}</p>
                  </div>
                  <p className="text-lg font-medium">{entry.estimated_carbs_g}g Carbs</p>
                </li>
              ))}
              {entries.length === 0 && <p className="p-6 text-gray-500">Belum ada data hari ini.</p>}
            </ul>
            <div className="bg-gray-50 px-6 py-3 font-bold text-right">Total Karbohidrat: {totalCarbs.toFixed(2)}g</div>
          </div>
        </div>
        <div>
           <h2 className="text-xl font-semibold mb-4">Analisis & Saran</h2>
           <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 mb-2">Total asupan karbohidrat Anda saat ini:</p>
              <p className="text-3xl font-bold mb-4">{currentRange}</p>
              {relevantSolution ? (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Saran untuk Anda:</h3>
                  <p className="text-gray-700">{relevantSolution.suggestion}</p>
                </div>
              ) : (
                <p className="text-gray-500">Belum ada saran yang cocok untuk rentang ini.</p>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}