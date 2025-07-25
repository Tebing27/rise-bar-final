// components/admin/PostFormButton.tsx
'use client';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button'; // Impor Button dari shadcn
import { Loader2 } from 'lucide-react'; // Impor ikon loading

export function PostFormButton({ isNew }: { isNew: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {pending ? 'Menyimpan...' : (isNew ? 'Buat Artikel' : 'Update Artikel')}
        </Button>
    )
}