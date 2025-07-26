// app/admin/users/edit/[id]/page.tsx
import { supabaseAdmin } from '@/lib/supabase-admin';
import { UserForm } from '@/components/admin/UserForm';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

async function getUser(id: string) {
    const { data } = await supabaseAdmin.from('users').select('*').eq('id', id).single();
    if (!data) notFound();
    return data;
}

async function getRoles() {
    const { data } = await supabaseAdmin.from('roles').select('*');
    return data || [];
}

// ✅ PERBAIKAN UNTUK NEXT.JS 15: params sekarang adalah Promise yang harus di-await
export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params; // Await the params Promise
    
    const [user, roles] = await Promise.all([
        getUser(id), // Gunakan id yang sudah di-await
        getRoles()
    ]);

    return (
        <div className="grid flex-1 items-start gap-4">
            <div className="flex items-center gap-4">
                <Link href="/admin/users">
                    <Button variant="outline" size="icon" className="h-7 w-7">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Kembali</span>
                    </Button>
                </Link>
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                    Edit Pengguna
                </h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Detail Pengguna</CardTitle>
                    <CardDescription>
                        Perbarui detail pengguna yang sudah ada di sistem.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <UserForm user={user} roles={roles} />
                </CardContent>
            </Card>
        </div>
    );
}