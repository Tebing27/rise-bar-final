// app/(auth)/login/page.tsx
"use client"; // <-- Tambahkan ini untuk menjadikan Client Component
import { LoginForm } from "@/components/auth/LoginForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image"; // <-- Import Image
import { Toaster } from "@/components/ui/sonner";

export default function LoginPage() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            {/* --- Tambahkan Gambar di Sini --- */}
            <div className="flex justify-center mb-4">
              <Image
                src="/mascot_berjelajah_arbie.webp" // Pastikan gambar ada di /public
                alt="Mascot Rice and Care"
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
          </CardContent>
        </Card>
      </div>
    </>
  );
}
