// app/admin/users/new/page.tsx
import { supabaseAdmin } from '@/lib/supabase-admin';
import { UserForm } from '@/components/admin/UserForm';

// Ambil daftar peran (roles) dari database
async function getRoles() {
    const { data } = await supabaseAdmin.from('roles').select('*');
    return data || [];
}

export default async function NewUserPage() {
    const roles = await getRoles();
    return (
        <div className="mx-auto max-w-4xl py-8 px-4">
            <h1 className="text-3xl font-bold mb-6">Tambah Pengguna Baru</h1>
            <div className="p-8 bg-white rounded-lg shadow">
                <UserForm roles={roles} />
            </div>
        </div>
    );
}