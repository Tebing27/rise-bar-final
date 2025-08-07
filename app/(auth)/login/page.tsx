// app/(auth)/login/page.tsx
"use client"; // <-- Tambahkan ini untuk menjadikan Client Component

import { useState } from "react"; // <-- Import useState
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { LoginForm } from "@/components/auth/LoginForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image"; // <-- Import Image
import { Toaster } from "@/components/ui/sonner";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
      <Toaster position="top-center" richColors />
      {isLoading && <LoadingSpinner />}
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
            <LoginForm setIsLoading={setIsLoading} />
            <div className="mt-4 text-center text-sm">
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Daftar di sini
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
