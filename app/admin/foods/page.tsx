// app/admin/foods/page.tsx
import { getFoods } from '@/lib/actions/foodActions';
import Link from 'next/link';
import { DeleteFoodButton } from '@/components/admin/DeleteFoodButton';
import { Toaster } from '@/components/ui/sonner';
import { Search } from '@/components/admin/Search';
import { Pagination } from '@/components/admin/Pagination';

export const dynamic = 'force-dynamic';

// Define the type for the page's props
type AdminFoodsPageProps = {
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
};

// Use the defined type in the function signature
export default async function AdminFoodsPage({ searchParams }: AdminFoodsPageProps) {
  // Await the searchParams to resolve the Promise
  const resolvedSearchParams = await searchParams;
  const searchQuery = resolvedSearchParams?.query || '';
  const currentPage = Number(resolvedSearchParams?.page) || 1;

  const { foods, totalPages } = await getFoods({ searchQuery, page: currentPage });

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Kelola Makanan</h1>
          </div>
          <div className="flex items-center gap-2">
            <Search placeholder="Cari makanan..." />
            <Link
              href="/admin/foods/new"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 whitespace-nowrap"
            >
              + Tambah Makanan
            </Link>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Nama Makanan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Kandungan Gula (g)</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-background divide-y">
              {foods && foods.map((food) => (
                <tr key={food.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{food.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{food.sugar_g}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                    <Link href={`/admin/foods/edit/${food.id}`} className="text-primary hover:underline mr-4">
                      Edit
                    </Link>
                    <DeleteFoodButton id={food.id} />
                  </td>
                </tr>
              ))}
              {(!foods || foods.length === 0) && (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-muted-foreground">Tidak ada data makanan yang cocok.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex justify-end">
          {totalPages > 0 && <Pagination totalPages={totalPages} />}
        </div>
      </div>
    </>
  );
}