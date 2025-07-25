// app/admin/foods/new/page.tsx
import { FoodForm } from '@/components/admin/FoodForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Toaster } from '@/components/ui/sonner';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewFoodPage() {
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
                        Tambah Makanan Baru
                    </h1>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Detail Makanan</CardTitle>
                        <CardDescription>
                            Isi detail makanan baru yang akan ditambahkan ke database.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FoodForm />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}