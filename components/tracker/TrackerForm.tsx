// components/tracker/TrackerForm.tsx
'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { addFoodEntry, type FormState } from '@/lib/actions/trackerActions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="md:col-start-3 w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:bg-indigo-300"
    >
      {pending ? 'Menyimpan...' : 'Simpan'}
    </button>
  );
}

export function TrackerForm({ userId }: { userId: string }) {
  const initialState: FormState = { success: false };
  const [formState, formAction] = useActionState(addFoodEntry, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formState.success) {
      formRef.current?.reset();
    }
  }, [formState]);

  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Tambah Makanan Baru</h2>
      <form ref={formRef} action={formAction} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <input type="hidden" name="userId" value={userId} />
        <div className="md:col-span-2">
          <label htmlFor="foodName" className="block text-sm font-medium text-gray-700">Nama Makanan</label>
          <input type="text" name="foodName" id="foodName" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          {formState.errors?.foodName && <p className="text-red-500 text-xs mt-1">{formState.errors.foodName[0]}</p>}
        </div>
        <div>
          <label htmlFor="carbs" className="block text-sm font-medium text-gray-700">Karbohidrat (gram)</label>
          <input type="number" name="carbs" id="carbs" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
           {formState.errors?.carbs && <p className="text-red-500 text-xs mt-1">{formState.errors.carbs[0]}</p>}
        </div>
        <SubmitButton />
        {formState.message && <p className={`md:col-span-3 text-sm ${formState.success ? 'text-green-600' : 'text-red-500'}`}>{formState.message}</p>}
      </form>
    </div>
  );
}