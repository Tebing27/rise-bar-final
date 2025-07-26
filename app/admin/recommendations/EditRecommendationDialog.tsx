// app/admin/recommendations/EditRecommendationDialog.tsx
'use client';

import { useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { upsertRecommendation, type Recommendation } from '@/lib/actions/recommendationActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Pencil, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// ✅ Perbaikan: Definisikan tipe spesifik untuk form state
type RecommendationFormState = {
  success?: string;
  error?: { [key: string]: string[] | undefined; } | string;
} | null;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</> : 'Simpan Perubahan'}
    </Button>
  );
}

export function EditRecommendationDialog({ recommendation }: { recommendation: Recommendation }) {
  const [open, setOpen] = useState(false);
  
  // ✅ Perbaikan: Berikan tipe pada prevState
  const clientAction = async (prevState: RecommendationFormState, formData: FormData) => {
    const result = await upsertRecommendation(prevState, formData);
    if (result?.success) {
      toast.success(result.success);
      setOpen(false);
    } else if (result?.error) {
      const errorMsg = typeof result.error === 'string' 
        ? result.error 
        : Object.values(result.error).flat().join(', ');
      toast.error(errorMsg);
    }
    return result;
  };

  // ✅ Perbaikan: Gunakan tipe yang sudah didefinisikan dan tandai state sebagai tidak terpakai
  const [, formAction] = useActionState(clientAction, null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="w-3 h-3 mr-1" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Rekomendasi</DialogTitle>
          <DialogDescription>
            Ubah detail rekomendasi. Perubahan akan langsung terlihat oleh pengguna.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4 pt-4">
          <input type="hidden" name="id" value={recommendation.id} />
          
          <div className="space-y-2">
            <Label htmlFor="title-edit">Judul Rekomendasi</Label>
            <Input id="title-edit" name="title" defaultValue={recommendation.title} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description-edit">Deskripsi</Label>
            <Textarea id="description-edit" name="description" defaultValue={recommendation.description} rows={4} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-edit">Kategori Status</Label>
            <Select name="category" defaultValue={recommendation.category} required>
              <SelectTrigger id="category-edit">
                <SelectValue placeholder="Pilih kategori status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tinggi">Tinggi</SelectItem>
                <SelectItem value="Normal">Normal</SelectItem>
                <SelectItem value="Rendah">Rendah</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4">
            <DialogClose asChild>
                <Button type="button" variant="secondary">Batal</Button>
            </DialogClose>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
