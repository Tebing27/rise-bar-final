// app/(auth)/register/page.tsx
"use client"; // <-- Tambahkan ini

import { useState } from "react"; // <-- Impor useState
import { RegisterForm } from "@/components/auth/RegisterForm";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"; // <-- Impor Spinner
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false); // <-- Tambahkan state loading

  return (
    <>
      <Toaster position="top-center" richColors />
      {isLoading && <LoadingSpinner />}{" "}
      {/* <-- Tampilkan spinner jika loading */}
      <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <Image
                src="/mascot_berjelajah_arbie.webp"
                alt="Mascot Onboarding"
                width={120}
                height={120}
              />
            </div>
            <CardTitle className="text-2xl font-bold">Buat Akun Baru</CardTitle>
            <CardDescription>
              Isi formulir di bawah untuk memulai perjalanan kesehatan Anda.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Kirim setIsLoading sebagai prop */}
            <RegisterForm setIsLoading={setIsLoading} />
            <div className="mt-4 text-center text-sm">
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Login di sini
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
