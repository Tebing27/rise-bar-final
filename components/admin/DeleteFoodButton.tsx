// components/admin/DeleteFoodButton.tsx
'use client';

import { deleteFood } from '@/lib/actions/foodActions';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'; // <-- Ganti impor

function DeleteButtonUI() {
    const { pending } = useFormStatus();
    return (
        // Gunakan DropdownMenuItem
        <DropdownMenuItem 
            className="text-destructive" 
            onSelect={(e) => e.preventDefault()} // Mencegah dropdown tertutup otomatis
        >
            <button type="submit" disabled={pending} className="w-full text-left">
              {pending ? 'Menghapus...' : 'Hapus'}
            </button>
        </DropdownMenuItem>
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
    <form action={actionWithId}>
      <DeleteButtonUI />
    </form>
  );
}