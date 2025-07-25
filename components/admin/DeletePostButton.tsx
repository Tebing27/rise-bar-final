// components/admin/DeletePostButton.tsx
'use client';

import { deletePost } from '@/lib/actions/blogActions';
import { useTransition } from 'react';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export function DeletePostButton({ postId }: { postId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
      startTransition(async () => {
        const result = await deletePost(postId);
        if (result.success) {
            toast.success(result.message);
        } else if(result.message) {
            toast.error(result.message);
        }
      });
    }
  };

  return (
    <DropdownMenuItem
      className="text-destructive"
      onSelect={(e) => {
        e.preventDefault();
        handleClick();
      }}
      disabled={isPending}
    >
      {isPending ? 'Menghapus...' : 'Hapus'}
    </DropdownMenuItem>
  );
}