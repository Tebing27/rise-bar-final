'use client';

import { deleteFood } from '@/lib/actions/foodActions';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

function DeleteButtonUI() {
    const { pending } = useFormStatus();
    return (
        <Button variant="destructive" size="sm" type="submit" disabled={pending}>
            {pending ? '...' : 'Hapus'}
        </Button>
    );
}

export function DeleteFoodButton({ id }: { id: string }) {
  const actionWithId = async () => {
    if (confirm('Apakah Anda yakin ingin menghapus makanan ini?')) {
        const formData = new FormData();
        formData.append('id', id);
        const result = await deleteFood(formData);
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
    }
  };

  return (
    <form action={actionWithId} className="inline">
      <DeleteButtonUI />
    </form>
  );
}