// app/admin/recommendations/DeleteRecommendationButton.tsx
'use client';

import { deleteRecommendation } from '@/lib/actions/recommendationActions';
import { Button } from '@/components/ui/button';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

function DeleteButtonUI() {
    const { pending } = useFormStatus();
    return (
        <Button variant="destructive" size="sm" type="submit" disabled={pending}>
            {pending ? 'Menghapus...' : 'Hapus'}
        </Button>
    )
}

export function DeleteRecommendationButton({ id }: { id: string }) {
    const action = async () => {
        if(confirm('Apakah Anda yakin ingin menghapus rekomendasi ini?')) {
            const result = await deleteRecommendation(id);
            if (result?.success) {
                toast.success(result.success);
            } else if (result?.error) {
                toast.error(result.error);
            }
        }
    };

    return (
        <form action={action}>
            <DeleteButtonUI />
        </form>
    );
}