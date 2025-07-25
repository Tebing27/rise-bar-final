// app/admin/users/new/page.tsx
import { supabaseAdmin } from '@/lib/supabase-admin';
import { UserForm } from '@/components/admin/UserForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

async function getRoles() {
    const { data } = await supabaseAdmin.from('roles').select('*');
    return data || [];
}

export default async function NewUserPage() {
    const roles = await getRoles();
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
                    Tambah Pengguna Baru
                </h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Detail Pengguna</CardTitle>
                    <CardDescription>
                        Isi detail untuk pengguna baru yang akan ditambahkan ke sistem.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <UserForm roles={roles} />
                </CardContent>
            </Card>
        </div>
    );
}