// components/auth/RegisterForm.tsx
'use client';

import { useActionState} from 'react';
// Hapus atau ganti 'useFormState' dari 'react-dom'
import { useFormStatus } from 'react-dom';

import { registerUser } from '@/lib/actions/authActions';
import type { FormState } from '@/lib/actions/trackerActions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300"
    >
      {pending ? 'Mendaftar...' : 'Daftar'}
    </button>
  );
}

export function RegisterForm() {
    const initialState: FormState = { success: false };
    // Ganti useFormState menjadi useActionState
    const [formState, formAction] = useActionState(registerUser, initialState);

  return (
    <form action={formAction} className="space-y-4">
       <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama</label>
        <input id="name" name="name" type="text" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
        {formState.errors?.name && <p className="text-red-500 text-xs mt-1">{formState.errors.name[0]}</p>}
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input id="email" name="email" type="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
        {formState.errors?.email && <p className="text-red-500 text-xs mt-1">{formState.errors.email[0]}</p>}
      </div>
       <div>
        <label htmlFor="password"className="block text-sm font-medium text-gray-700">Password</label>
        <input id="password" name="password" type="password" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
        {formState.errors?.password && <p className="text-red-500 text-xs mt-1">{formState.errors.password[0]}</p>}
      </div>
      <SubmitButton />
      {formState.message && <p className={`mt-2 text-sm text-center ${formState.success ? 'text-green-600' : 'text-red-500'}`}>{formState.message}</p>}
    </form>
  );
}