'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
// FIX: Change this import path
import { deleteTrackerEntry } from '@/lib/actions/trackerActions'; 
import { toast } from 'sonner';;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="destructive" size="sm" disabled={pending}>
      {pending ? '...' : 'Hapus'}
    </Button>
  );
}

export function DeleteEntryButton({ id }: { id: string }) {
  // Menggunakan formAction untuk menangani notifikasi
  const formAction = async (formData: FormData) => {
    const result = await deleteTrackerEntry(id);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success('Data berhasil dihapus.');
    }
  };

  return (
    <form action={formAction}>
      <SubmitButton />
    </form>
  );
}