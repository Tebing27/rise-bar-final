// app/admin/users/edit/[id]/page.tsx
import { supabaseAdmin } from '@/lib/supabase-admin';
import { UserForm } from '@/components/admin/UserForm';
import { notFound } from 'next/navigation';

async function getUser(id: string) {
    const { data } = await supabaseAdmin.from('users').select('*').eq('id', id).single();
    if (!data) notFound();
    return data;
}

async function getRoles() {
    const { data } = await supabaseAdmin.from('roles').select('*');
    return data || [];
}

export default async function EditUserPage({ params }: { params: { id: string } }) {
    const [user, roles] = await Promise.all([
        getUser(params.id),
        getRoles()
    ]);

    return (
        <div className="mx-auto max-w-4xl py-8 px-4">
            <h1 className="text-3xl font-bold mb-6">Edit Pengguna</h1>
            <div className="p-8 bg-white rounded-lg shadow">
                <UserForm user={user} roles={roles} />
            </div>
        </div>
    );
}