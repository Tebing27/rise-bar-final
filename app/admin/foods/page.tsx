// app/admin/foods/page.tsx
import { getFoods } from '@/lib/actions/foodActions';
import Link from 'next/link';
import { DeleteFoodButton } from '@/components/admin/DeleteFoodButton';
import { Toaster } from '@/components/ui/sonner';
import { Search } from '@/components/admin/Search';
import { Pagination } from '@/components/admin/Pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

export const dynamic = 'force-dynamic';

type AdminFoodsPageProps = {
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
};

export default async function AdminFoodsPage({ searchParams }: AdminFoodsPageProps) {
  const resolvedSearchParams = await searchParams;
  const searchQuery = resolvedSearchParams?.query || '';
  const currentPage = Number(resolvedSearchParams?.page) || 1;

  const { foods, totalPages } = await getFoods({ searchQuery, page: currentPage });

  return (
    <>
      <Toaster position="top-center" richColors />
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <CardTitle>Kelola Makanan</CardTitle>
              <CardDescription>Tambah, edit, atau hapus data makanan untuk database.</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <Search placeholder="Cari makanan..." />
              <Link href="/admin/foods/new">
                <Button className="w-full sm:w-auto">+ Tambah Makanan</Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Makanan</TableHead>
                  <TableHead>Gula (g)</TableHead>
                  <TableHead><span className="sr-only">Aksi</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {foods && foods.map((food) => (
                  <TableRow key={food.id}>
                    <TableCell className="font-medium">{food.name}</TableCell>
                    <TableCell>{food.sugar_g}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Link href={`/admin/foods/edit/${food.id}`}>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                          </Link>
                          <DeleteFoodButton id={food.id} />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {(!foods || foods.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      Tidak ada data makanan yang cocok.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-6 flex justify-end">
            {totalPages > 0 && <Pagination totalPages={totalPages} />}
          </div>
        </CardContent>
      </Card>
    </>
  );
}