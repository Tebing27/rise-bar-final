// app/(main)/profile/page.tsx
'use client';

// ✅ PERBAIKAN: Tambahkan 'useState' ke dalam impor dari 'react'
import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { getUserProfile, updateUserProfile, UserProfile } from '@/lib/actions/userActions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Toaster, toast } from 'sonner';
import { redirect } from 'next/navigation';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Menyimpan...' : 'Simpan Perubahan'}
    </Button>
  );
}

// Komponen Form Profil
function ProfileForm({ user }: { user: UserProfile }) {
  const [state, formAction] = useActionState(updateUserProfile, null);

  useEffect(() => {
    if ((state as any)?.success) toast.success((state as any).message);
    if (!(state as any)?.success && (state as any)?.message) toast.error((state as any).message);
  }, [state]);

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <Label htmlFor="name">Nama Lengkap</Label>
        <Input id="name" name="name" defaultValue={user.name || ''} required className='mt-4'/>
        {(state as any)?.errors?.name && <p className="text-red-500 text-xs mt-1">{(state as any).errors.name[0]}</p>}
      </div>

      <div>
        <Label htmlFor="date_of_birth">Tanggal Lahir</Label>
        <Input id="date_of_birth" name="date_of_birth" type="date" defaultValue={user.date_of_birth || ''} required className='mt-4'/>
        {(state as any)?.errors?.date_of_birth && <p className="text-red-500 text-xs mt-1">{(state as any).errors.date_of_birth[0]}</p>}
      </div>

      <div>
        <Label htmlFor="gender" className='mb-4'>Jenis Kelamin</Label>
        <Select name="gender" defaultValue={user.gender || ''} required>
          <SelectTrigger>
            <SelectValue placeholder="Pilih jenis kelamin..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pria">Pria</SelectItem>
            <SelectItem value="Wanita">Wanita</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="diabetes_type" className='mb-4'>Kondisi/Tipe Diabetes</Label>
        <Select name="diabetes_type" defaultValue={user.diabetes_type || ''} required>
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
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="height_cm">Tinggi Badan (cm)</Label>
          <Input id="height_cm" name="height_cm" type="number" placeholder="Opsional" defaultValue={user.height_cm || ''} className='mt-4'/>
        </div>
        <div>
          <Label htmlFor="weight_kg">Berat Badan (kg)</Label>
          <Input id="weight_kg" name="weight_kg" type="number" step="0.1" placeholder="Opsional" defaultValue={user.weight_kg?.toString() || ''} className='mt-4'/>
        </div>
      </div>

      <div className="pt-2">
        <SubmitButton />
      </div>
    </form>
  );
}

// Komponen Utama Halaman Profil
export default function ProfilePage() {
    const [user, setUser] = useState<UserProfile | null>(null);

    useEffect(() => {
        getUserProfile().then(profile => {
            if (!profile) {
                redirect('/login');
            }
            setUser(profile);
        });
    }, []);

    if (!user) {
        return <div className="container text-center py-20">Memuat profil...</div>;
    }

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="container mx-auto max-w-2xl py-10">
        <div className="mb-4">
            <h1 className="text-3xl font-bold tracking-tight">Profil Saya</h1>
            <p className="text-muted-foreground">Lihat dan perbarui informasi pribadi Anda di sini.</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <ProfileForm user={user} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
