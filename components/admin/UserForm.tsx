// components/admin/UserForm.tsx
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { upsertUser } from "@/lib/actions/userActions";
import type { FormState } from "@/lib/actions/userActions";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface Role {
  id: string;
  name: string;
}

interface User {
  id?: string;
  name?: string;
  email?: string;
  role_id?: string;
}

function SubmitButton({ isNew }: { isNew: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {pending ? 'Menyimpan...' : (isNew ? 'Buat Pengguna' : 'Update Pengguna')}
        </Button>
    )
}

export function UserForm({ user, roles }: { user?: User, roles: Role[] }) {
    const initialState: FormState = { success: false };
    const [state, formAction] = useActionState(upsertUser, initialState);

    return (
        <form action={formAction} className="space-y-6">
            <input type="hidden" name="id" value={user?.id || ''} />
            
            <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input type="text" name="name" id="name" defaultValue={user?.name} required />
                {state.errors?.name && <p className="text-destructive text-xs mt-1">{state.errors.name[0]}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input type="email" name="email" id="email" defaultValue={user?.email} required />
                {state.errors?.email && <p className="text-destructive text-xs mt-1">{state.errors.email[0]}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input type="password" name="password" id="password" placeholder={user ? "Kosongkan jika tidak ingin ganti" : ""} />
                {state.errors?.password && <p className="text-destructive text-xs mt-1">{state.errors.password[0]}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="role_id">Peran (Role)</Label>
                <Select name="role_id" defaultValue={user?.role_id} required>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih peran" />
                    </SelectTrigger>
                    <SelectContent>
                        {roles.map(role => (
                            <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {state.errors?.role_id && <p className="text-destructive text-xs mt-1">{state.errors.role_id[0]}</p>}
            </div>
            
            <div className="flex justify-end pt-2">
                <SubmitButton isNew={!user} />
            </div>
            {state.message && !state.success && <p className="text-destructive text-sm mt-2">{state.message}</p>}
        </form>
    );
}