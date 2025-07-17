// components/admin/DeletePostButton.tsx
'use client';

import { deletePost } from '@/lib/actions/blogActions';
import { useTransition } from 'react';

export function DeletePostButton({ postId }: { postId: string }) {
  // useTransition untuk menangani state loading tanpa memblokir UI
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    // Tampilkan dialog konfirmasi
    if (confirm('Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan.')) {
      startTransition(async () => {
        // Panggil server action
        const result = await deletePost(postId);
        if (!result.success) {
          alert(result.message); // Tampilkan error jika gagal
        }
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="ml-4 text-red-600 hover:text-red-900 disabled:text-gray-400"
    >
      {isPending ? 'Menghapus...' : 'Hapus'}
    </button>
  );
}