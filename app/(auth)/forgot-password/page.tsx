// app/(auth)/forgot-password/page.tsx
'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { sendPasswordResetLink, type PasswordFormState } from '@/lib/actions/passwordActions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast, Toaster } from 'sonner';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Kirim Link Reset
    </Button>
  );
}

export default function ForgotPasswordPage() {
  const initialState: PasswordFormState = null; // State awal bisa null
  const [state, formAction] = useActionState(sendPasswordResetLink, initialState);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.success);
    }
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Image 
                src="/mascot_bertanya_arbie.webp" 
                alt="Mascot Rise Bar"
                width={100}
                height={100}
              />
            </div>
            <CardTitle className="text-2xl font-bold">Lupa Password</CardTitle>
            <CardDescription>
              Masukkan email Anda dan kami akan mengirimkan link untuk mereset password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="nama@email.com"
                />
              </div>
              <SubmitButton />
            </form>
             <div className="mt-4 text-center text-sm">
              Ingat password Anda?{' '}
              <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}