// app/admin/foods/new/page.tsx
import { FoodForm } from '@/components/admin/FoodForm';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import Link from 'next/link';

export default function NewFoodPage() {
    return (
        <>
           <Toaster position="top-center" richColors />
      <div className="container mx-auto max-w-2xl py-10 px-4">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Tambah Makanan Baru</h1>
            {/* --- TOMBOL BATAL DITAMBAHKAN DI SINI --- */}
            <Link href="/admin/foods">
                <Button>Batal</Button>
            </Link>
        </div>
        <div className="p-8 bg-card rounded-lg shadow-sm border">
          <FoodForm />
        </div>
      </div>
        </>
    );
}