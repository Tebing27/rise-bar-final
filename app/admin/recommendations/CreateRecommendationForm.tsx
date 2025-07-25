// app/admin/recommendations/CreateRecommendationForm.tsx
'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { upsertRecommendation } from '@/lib/actions/recommendationActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? 'Menyimpan...' : 'Simpan Rekomendasi'}
    </Button>
  );
}

export function CreateRecommendationForm() {
    const [state, formAction] = useActionState(upsertRecommendation, null);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state?.success) {
            toast.success(state.success);
            formRef.current?.reset(); // Reset form setelah sukses
        } else if (state?.error) {
            const errorMsg = typeof state.error === 'string' 
              ? state.error 
              : Object.values(state.error).flat().join(', ');
            toast.error(errorMsg);
        }
    }, [state]);

    return (
      <Card>
        <CardHeader>
          <CardTitle>Tambah Rekomendasi Baru</CardTitle>
          <CardDescription>Rekomendasi ini akan muncul di halaman analisis pengguna.</CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} action={formAction} className="space-y-4">
              <div className="space-y-2">
                  <Label htmlFor="title">Judul Rekomendasi</Label>
                  <Input id="title" name="title" placeholder="cth: Perbanyak Minum Air Putih" required />
              </div>
               <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea id="description" name="description" placeholder="Jelaskan secara singkat..." rows={3} required />
              </div>
               <div className="space-y-2">
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
              <div className="flex justify-end pt-2">
                  <SubmitButton />
              </div>
          </form>
        </CardContent>
      </Card>
    );
}