// app/(auth)/login/page.tsx
import { LoginForm } from '@/components/auth/LoginForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image'; // <-- Import Image

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          {/* --- Tambahkan Gambar di Sini --- */}
          <div className="flex justify-center mb-4">
            <Image 
              src="/mascot_berjelajah_arbie.png" // Pastikan gambar ada di /public
              alt="Mascot Rise Bar"
              width={100}
              height={100}
            />
          </div>
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Masukkan email Anda untuk masuk ke akun Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <div className="mt-4 text-center text-sm">
            Belum punya akun?{' '}
            <Link href="/register" className="font-medium text-primary underline-offset-4 hover:underline">
              Daftar di sini
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}