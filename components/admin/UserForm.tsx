// components/admin/UserForm.tsx
'use client'; // Tambahkan ini di baris pertama

import { useActionState } from 'react';
import { upsertUser } from "@/lib/actions/userActions";
import type { FormState } from "@/lib/actions/userActions"; // Impor tipe

export function UserForm({ user, roles }: { user?: any, roles: any[] }) {
    const initialState: FormState = { success: false };
    const [state, formAction] = useActionState(upsertUser, initialState);

    return (
        // Gunakan formAction dari hook
        <form action={formAction} className="space-y-6">
            <input type="hidden" name="id" value={user?.id || ''} />
            
            <div>
                <label htmlFor="name" className="block text-sm font-medium">Nama</label>
                <input type="text" name="name" id="name" defaultValue={user?.name} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                {state.errors?.name && <p className="text-red-500 text-xs mt-1">{state.errors.name[0]}</p>}
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium">Email</label>
                <input type="email" name="email" id="email" defaultValue={user?.email} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                {state.errors?.email && <p className="text-red-500 text-xs mt-1">{state.errors.email[0]}</p>}
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium">Password</label>
                <input type="password" name="password" id="password" placeholder={user ? "Kosongkan jika tidak ingin ganti" : ""} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                {state.errors?.password && <p className="text-red-500 text-xs mt-1">{state.errors.password[0]}</p>}
            </div>

            <div>
                <label htmlFor="role_id" className="block text-sm font-medium">Peran (Role)</label>
                <select name="role_id" id="role_id" defaultValue={user?.role_id} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                    <option value="" disabled>Pilih peran</option>
                    {roles.map(role => (
                        <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                </select>
                {state.errors?.role_id && <p className="text-red-500 text-xs mt-1">{state.errors.role_id[0]}</p>}
            </div>
            
            <div className="text-right">
                <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                    {user ? 'Update Pengguna' : 'Buat Pengguna'}
                </button>
            </div>
            {state.message && !state.success && <p className="text-red-500 text-sm mt-2">{state.message}</p>}
        </form>
    );
}