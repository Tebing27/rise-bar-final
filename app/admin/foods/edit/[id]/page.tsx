// app/admin/foods/edit/[id]/page.tsx
import { getFoodById } from '@/lib/actions/foodActions';
import { FoodForm } from '@/components/admin/FoodForm';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type EditFoodPageProps = {
  params: Promise<{ id: string; }>;
};

export default async function EditFoodPage({ params }: EditFoodPageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const food = await getFoodById(id);

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="grid flex-1 items-start gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/foods">
              <Button variant="outline" size="icon" className="h-7 w-7">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">Kembali</span>
              </Button>
          </Link>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Edit Makanan
          </h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Detail Makanan</CardTitle>
            <CardDescription>
              Perbarui detail makanan yang sudah ada di database.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FoodForm food={food} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}