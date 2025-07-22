// app/admin/recommendations/CreateRecommendationForm.tsx
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { upsertRecommendation } from '@/lib/actions/recommendationActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { useEffect } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? 'Menyimpan...' : 'Simpan Rekomendasi'}
    </Button>
  );
}

export function CreateRecommendationForm() {
    const [state, formAction] = useActionState(upsertRecommendation, null);

    useEffect(() => {
        if (state?.success) {
            toast.success(state.success);
        } else if (state?.error) {
            const errorMsg = typeof state.error === 'string' 
              ? state.error 
              : Object.values(state.error).flat().join(', ');
            toast.error(errorMsg);
        }
    }, [state]);

    return (
        <form action={formAction} key={state?.success ? Date.now() : 'static'} className="mb-8 p-6 border rounded-lg space-y-4 bg-card">
            <h3 className="text-xl font-semibold">Tambah Rekomendasi Baru</h3>
            <div>
                <Label htmlFor="title">Judul Rekomendasi</Label>
                <Input id="title" name="title" placeholder="cth: Perbanyak Minum Air Putih" required />
            </div>
             <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea id="description" name="description" placeholder="Jelaskan secara singkat rekomendasi Anda..." rows={4} required />
            </div>
             <div>
                <Label htmlFor="category">Kategori Status</Label>
                <Select name="category" required>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori status..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Tinggi">Tinggi</SelectItem>
                        <SelectItem value="Normal">Normal</SelectItem>
                        <SelectItem value="Rendah">Rendah</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="text-right">
                <SubmitButton />
            </div>
        </form>
    );
}