// components/auth/LoginForm.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

// 1. Terima prop setIsLoading dari LoginPage
export function LoginForm({
  setIsLoading,
}: {
  setIsLoading: (isLoading: boolean) => void;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // 2. Ganti nama state ini menjadi 'isSubmitting' agar lebih jelas fungsinya
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true); // 3. Aktifkan loading spinner satu layar penuh
    setIsSubmitting(true); // 4. Aktifkan loading di dalam tombol

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Email atau password salah. Silakan coba lagi.");
        setIsLoading(false); // 5. Matikan loading spinner jika terjadi error
      } else {
        // Redirect akan menangani sisanya, spinner akan hilang saat halaman berganti
        router.push("/tracker");
      }
    } catch {
      setError("Terjadi kesalahan. Coba beberapa saat lagi.");
      setIsLoading(false); // 5. Matikan juga spinner jika ada exception
    } finally {
      setIsSubmitting(false); // 6. Selalu aktifkan kembali tombol setelah selesai
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-destructive text-sm font-medium">{error}</p>}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nama@email.com"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-primary hover:underline"
          >
            Lupa Password?
          </Link>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        {/* 7. Kondisi disabled tombol sekarang menggunakan isSubmitting */}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Masuk
        </Button>
      </div>
    </form>
  );
}
