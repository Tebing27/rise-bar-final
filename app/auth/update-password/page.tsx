// app/auth/update-password/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast, Toaster } from 'sonner';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // onAuthStateChange sekarang mengembalikan listener, bukan data session langsung
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Logika ini benar: kita hanya peduli pada event 'PASSWORD_RECOVERY'
        // dan mengabaikan redirect jika ada sesi sementara.
        if (event === 'SIGNED_IN' && session) {
          router.replace('/tracker');
        }
      }
    );

    return () => {
      // Unsubscribe dilakukan pada object subscription dari listener
      authListener.subscription.unsubscribe();
    };
  }, [router, supabase]);

  const handleUpdatePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password: password });

    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Password berhasil diperbarui! Anda akan diarahkan ke halaman login.');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Image 
                src="/mascot_berjelajah_arbie.png" // Menggunakan gambar yang direkomendasikan
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
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password Baru</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan Password Baru
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}