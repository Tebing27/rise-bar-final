// components/auth/RegisterForm.tsx
'use client';

import { useActionState } from 'react'; // Ganti dari 'react-dom' ke 'react'
import { useFormStatus } from 'react-dom';

import { registerUser } from '@/lib/actions/authActions';
import type { FormState } from '@/lib/actions/trackerActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Mendaftar...' : 'Daftar'}
    </Button>
  );
}

export function RegisterForm() {
    const initialState: FormState = { success: false };
    const [formState, formAction] = useActionState(registerUser, initialState);

  return (
    <form action={formAction} className="space-y-4">
       <div>
        <Label htmlFor="name">Nama</Label>
        <Input id="name" name="name" type="text" required className="mt-1" />
        {formState.errors?.name && <p className="text-red-500 text-xs mt-1">{formState.errors.name[0]}</p>}
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required className="mt-1" />
        {formState.errors?.email && <p className="text-red-500 text-xs mt-1">{formState.errors.email[0]}</p>}
      </div>
       <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required className="mt-1" />
        {formState.errors?.password && <p className="text-red-500 text-xs mt-1">{formState.errors.password[0]}</p>}
      </div>
      <SubmitButton />
      {formState.message && <p className={`mt-2 text-sm text-center ${formState.success ? 'text-green-600' : 'text-red-500'}`}>{formState.message}</p>}
    </form>
  );
}