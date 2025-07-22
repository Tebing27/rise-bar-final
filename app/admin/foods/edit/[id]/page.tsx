// app/admin/foods/edit/[id]/page.tsx
import { getFoodById } from '@/lib/actions/foodActions';
import { FoodForm } from '@/components/admin/FoodForm';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Define the type for the page's props
type EditFoodPageProps = {
  params: Promise<{
    id: string;
  }>;
};

// Use the defined type in the function signature
export default async function EditFoodPage({ params }: EditFoodPageProps) {
  // Await the params to resolve the Promise
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const food = await getFoodById(id);

  return (
    <>
<Toaster position="top-center" richColors />
      <div className="container mx-auto max-w-2xl py-10 px-4">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Edit Makanan</h1>
            {/* --- TOMBOL BATAL DITAMBAHKAN DI SINI --- */}
            <Link href="/admin/foods">
                <Button>Batal</Button>
            </Link>
        </div>
        <div className="p-8 bg-card rounded-lg shadow-sm border">
          <FoodForm food={food} />
        </div>
      </div>
    </>
  );
}