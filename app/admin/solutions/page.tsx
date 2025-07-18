// app/admin/solutions/page.tsx
import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Ambil semua solusi dari database
async function getSolutions() {
  const { data, error } = await supabaseAdmin.from('solutions').select('*');
  if (error) {
    console.error('Error fetching solutions:', error);
    return [];
  }
  return data;
}

export default async function AdminSolutionsPage() {
  const solutions = await getSolutions();

  // SERVER ACTION UNTUK UPSERT (langsung di sini)
  async function upsertSolutionAction(formData: FormData) {
    'use server';

    const SolutionSchema = z.object({
      glucose_range: z.string().min(1, 'Rentang glukosa harus diisi.'),
      suggestion: z.string().min(10, 'Saran minimal 10 karakter.'),
    });

    const data = Object.fromEntries(formData.entries());
    const validatedFields = SolutionSchema.safeParse(data);

    if (!validatedFields.success) {
      // Anda bisa menangani error ini lebih lanjut jika perlu
      return;
    }
    
    await supabaseAdmin.from('solutions').upsert(validatedFields.data);
    revalidatePath('/admin/solutions');
  }

  // SERVER ACTION UNTUK DELETE (langsung di sini)
  async function deleteSolutionAction(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    if (id && confirm('Apakah Anda yakin ingin menghapus solusi ini?')) {
        await supabaseAdmin.from('solutions').delete().eq('id', id);
        revalidatePath('/admin/solutions');
    }
  }


  return (
    <div className="mx-auto max-w-4xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Kelola Solusi Glukosa</h1>

      {/* Form untuk menambah/edit solusi */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Tambah Solusi Baru</h2>
        <form action={upsertSolutionAction} className="space-y-4">
          <div>
            <label htmlFor="glucose_range" className="block text-sm font-medium">Rentang Glukosa</label>
            <input type="text" name="glucose_range" id="glucose_range" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="Contoh: Rendah, Normal, Tinggi"/>
          </div>
          <div>
            <label htmlFor="suggestion" className="block text-sm font-medium">Saran / Solusi</label>
            <textarea name="suggestion" id="suggestion" required rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
          </div>
          <div className="text-right">
            <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
              Simpan Solusi
            </button>
          </div>
        </form>
      </div>

      {/* Tabel daftar solusi */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rentang</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Saran</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {solutions.map((solution) => (
              <tr key={solution.id}>
                <td className="px-6 py-4 font-medium">{solution.glucose_range}</td>
                <td className="px-6 py-4">{solution.suggestion}</td>
                <td className="px-6 py-4 flex items-center">
                  <form action={deleteSolutionAction}>
                      <input type="hidden" name="id" value={solution.id} />
                      <button type="submit" className="text-red-600 hover:text-red-900">
                          Hapus
                      </button>
                  </form>
                </td>
              </tr>
            ))}
             {solutions.length === 0 && (
                <tr><td colSpan={3} className="text-center py-4 text-gray-500">Belum ada solusi.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}