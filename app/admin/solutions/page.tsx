// app/admin/solutions/page.tsx
import { getSolutions, createSolution, deleteSolution, updateSolution } from '@/lib/actions/solutionActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { revalidatePath } from 'next/cache';
import { EditSolutionDialog } from './EditSolutionDialog';

async function SolutionForm() {
    async function handleCreate(formData: FormData) {
        'use server';
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        
        if (title && description) {
            const result = await createSolution({ title, description });
            revalidatePath('/admin/solutions');
            
            // You can handle the result here if needed
            if (result.error) {
                console.error('Error creating solution:', result.error);
            }
        }
    }

    return (
        <form action={handleCreate} className="mb-8 p-6 border rounded-lg space-y-4 bg-card">
            <h3 className="text-xl font-semibold">Tambah Solusi Baru</h3>
            <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                    Judul Solusi
                </label>
                <Input 
                    id="title"
                    name="title" 
                    placeholder="Masukkan judul solusi" 
                    required
                    className="w-full"
                />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                    Deskripsi Solusi
                </label>
                <Textarea 
                    id="description"
                    name="description" 
                    placeholder="Masukkan deskripsi lengkap solusi" 
                    required
                    rows={4}
                    className="w-full"
                />
            </div>
            <Button type="submit" className="w-full sm:w-auto">
                Simpan Solusi
            </Button>
        </form>
    );
}

export default async function AdminSolutionsPage() {
  const solutions = await getSolutions();

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Kelola Rekomendasi Solusi</h1>
        <p className="text-muted-foreground">
          Tambah, edit, atau hapus solusi yang akan direkomendasikan kepada pengguna.
        </p>
      </div>

      <SolutionForm />

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold mb-4">
          Daftar Solusi ({solutions.length})
        </h2>
        
        {solutions.length === 0 ? (
          <div className="text-center py-12 bg-muted/50 rounded-lg">
            <p className="text-muted-foreground">Belum ada solusi yang ditambahkan.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Gunakan form di atas untuk menambahkan solusi pertama.
            </p>
          </div>
        ) : (
          solutions.map((solution) => (
            <div key={solution.id} className="p-6 border rounded-lg bg-card">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="flex-1 space-y-2">
                  <h3 className="font-bold text-lg">{solution.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {solution.description}
                  </p>
                  {solution.created_at && (
                    <p className="text-xs text-muted-foreground">
                      Dibuat: {new Date(solution.created_at).toLocaleDateString('id-ID')}
                    </p>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <EditSolutionDialog solution={solution} />
                  
                  <form action={async () => {
                      'use server';
                      if (solution.id) {
                        const result = await deleteSolution(solution.id);
                        revalidatePath('/admin/solutions');
                        
                        if (result.error) {
                          console.error('Error deleting solution:', result.error);
                        }
                      }
                  }}>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        type="submit"
                        className="w-full sm:w-auto"
                      >
                        Hapus
                      </Button>
                  </form>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}