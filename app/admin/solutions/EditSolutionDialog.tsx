// components/admin/EditSolutionDialog.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { updateSolution, type Solution } from '@/lib/actions/solutionActions';
import { useRouter } from 'next/navigation';
import { Pencil, Loader2 } from 'lucide-react';

interface EditSolutionDialogProps {
  solution: Solution;
}

export function EditSolutionDialog({ solution }: EditSolutionDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(solution.title);
  const [description, setDescription] = useState(solution.description);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!solution.id) {
      setError('ID solusi tidak valid');
      return;
    }

    if (!title.trim() || !description.trim()) {
      setError('Judul dan deskripsi harus diisi');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const result = await updateSolution(solution.id, {
        title: title.trim(),
        description: description.trim(),
      });

      if (result.error) {
        setError(result.error);
      } else {
        setOpen(false);
        router.refresh(); // Refresh the page to show updated data
      }
    } catch (error) {
      setError('Terjadi kesalahan yang tidak terduga');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    setTitle(solution.title);
    setDescription(solution.description);
    setError('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full sm:w-auto">
          <Pencil className="w-4 h-4 mr-1" />
          Edit
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Solusi</DialogTitle>
          <DialogDescription>
            Ubah judul dan deskripsi solusi. Klik simpan untuk menyimpan perubahan.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="edit-title" className="text-sm font-medium">
              Judul Solusi
            </label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul solusi"
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="edit-description" className="text-sm font-medium">
              Deskripsi Solusi
            </label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Masukkan deskripsi lengkap solusi"
              rows={4}
              disabled={isSubmitting}
              required
            />
          </div>
          
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Simpan Perubahan'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

