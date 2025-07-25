// components/auth/RegisterForm.tsx
'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { registerUser } from '@/lib/actions/authActions';
import type { FormState } from '@/lib/actions/authActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Daftar
    </Button>
  );
}

export function RegisterForm() {
    const initialState: FormState = { success: false };
    const [formState, formAction] = useActionState(registerUser, initialState);

    useEffect(() => {
        if (formState.message) {
            if (formState.success) {
                toast.success(formState.message);
            } else {
                toast.error(formState.message);
            }
        }
    }, [formState]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nama Lengkap</Label>
        <Input id="name" name="name" type="text" required placeholder="Nama Anda" />
        {formState.errors?.name && <p className="text-destructive text-xs mt-1">{formState.errors.name[0]}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required placeholder="nama@email.com" />
        {formState.errors?.email && <p className="text-destructive text-xs mt-1">{formState.errors.email[0]}</p>}
      </div>
       <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required />
        {formState.errors?.password && <p className="text-destructive text-xs mt-1">{formState.errors.password[0]}</p>}
      </div>
      <SubmitButton />
    </form>
  );
}