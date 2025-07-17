// components/admin/PostFormButton.tsx
'use client';
import { useFormStatus } from 'react-dom';

export function PostFormButton({ isNew }: { isNew: boolean }) {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:bg-indigo-400">
            {pending ? 'Menyimpan...' : (isNew ? 'Buat Artikel' : 'Update Artikel')}
        </button>
    )
}