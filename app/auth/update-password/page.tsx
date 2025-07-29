// app/auth/update-password/page.tsx
'use client';

import { useEffect, Suspense, useActionState } from 'react'; // <-- Import useActionState dari 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { resetPassword, type PasswordFormState } from '@/lib/actions/passwordActions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast, Toaster } from 'sonner';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Simpan Password Baru
    </Button>
  );
}

function UpdatePasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const initialState: PasswordFormState = null;
    const [state, formAction] = useActionState(resetPassword, initialState);

    useEffect(() => {
        if (state?.success) {
            toast.success(state.success);
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        }
        if (state?.error) {
            toast.error(state.error);
        }
    }, [state, router]);

    return (
        <form action={formAction} className="space-y-4">
            <input type="hidden" name="token" value={token || ''} />
            <div className="space-y-2">
                <Label htmlFor="password">Password Baru</Label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={6}
                    placeholder="Minimal 6 karakter"
                />
            </div>
            <SubmitButton />
        </form>
    );
}

export default function UpdatePasswordPage() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Image 
                src="/mascot_berjelajah_arbie.webp" // Ganti dengan gambar yang sesuai
                alt="Mascot Rise Bar"
                width={100}
                height={100}
              />
            </div>
            <CardTitle className="text-2xl font-bold">Reset Password Anda</CardTitle>
            <CardDescription>
              Masukkan password baru Anda di bawah ini.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Memuat...</div>}>
                <UpdatePasswordForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </>
  );
}