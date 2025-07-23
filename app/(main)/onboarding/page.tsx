// app/(main)/onboarding/page.tsx
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { completeOnboarding } from '@/lib/actions/userActions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Toaster, toast } from 'sonner';
import { useEffect } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Menyimpan...' : 'Selesai & Lanjutkan ke Dashboard'}
    </Button>
  );
}

export default function OnboardingPage() {
  const [state, formAction] = useActionState(completeOnboarding, null);

  useEffect(() => {
    if ((state as any)?.message && !(state as any).success) {
      toast.error((state as any).message);
    }
  }, [state]);

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="container mx-auto flex min-h-screen items-center justify-center py-12">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Selamat Datang!</CardTitle>
            <CardDescription>Lengkapi profil Anda untuk mendapatkan analisis yang lebih akurat.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-6">
              
              <div>
                <Label htmlFor="date_of_birth">Tanggal Lahir</Label>
                <Input id="date_of_birth" name="date_of_birth" type="date" className='mt-4' required />
                {(state as any)?.errors?.date_of_birth && <p className="text-red-500 text-xs mt-1">{(state as any).errors.date_of_birth[0]}</p>}
              </div>

              <div>
                <Label htmlFor="gender" className='mb-4'>Jenis Kelamin</Label>
                <Select name="gender" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis kelamin..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pria">Pria</SelectItem>
                    <SelectItem value="Wanita">Wanita</SelectItem>
                  </SelectContent>
                </Select>
                 {(state as any)?.errors?.gender && <p className="text-red-500 text-xs mt-1">{(state as any).errors.gender[0]}</p>}
              </div>

              <div>
                <Label htmlFor="diabetes_type" className='mb-4'>Kondisi/Tipe Diabetes</Label>
                <Select name="diabetes_type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kondisi Anda..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tidak Ada">Tidak Ada / Sehat</SelectItem>
                    <SelectItem value="Pra-diabetes">Pra-diabetes</SelectItem>
                    <SelectItem value="Tipe 1">Tipe 1</SelectItem>
                    <SelectItem value="Tipe 2">Tipe 2</SelectItem>
                    <SelectItem value="Gestational">Gestational</SelectItem>
                  </SelectContent>
                </Select>
                 {(state as any)?.errors?.diabetes_type && <p className="text-red-500 text-xs mt-1">{(state as any).errors.diabetes_type[0]}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="height_cm">Tinggi Badan (cm)</Label>
                  <Input id="height_cm" name="height_cm" type="number" placeholder="Opsional" className='mt-4'/>
                </div>
                <div>
                  <Label htmlFor="weight_kg">Berat Badan (kg)</Label>
                  <Input id="weight_kg" name="weight_kg" type="number" step="0.1" placeholder="Opsional" className='mt-4'/>
                </div>
              </div>

              <SubmitButton />
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
