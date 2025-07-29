// app/not-found.tsx

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center space-y-8 bg-background px-4 py-12 text-center">
      
      {/* Gambar Maskot */}
      <Image
        src="/mascot_bertanya.webp"
        alt="Mascot Rise Bar Bertanya"
        width={160}
        height={160}
        className="drop-shadow-lg"
      />
      
      {/* Grup Teks Judul */}
      <div className="max-w-md space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-foreground">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-lg text-muted-foreground">
          Maaf, kami tidak dapat menemukan halaman yang Anda cari.
        </p>
      </div>
      
      {/* Tombol Aksi */}
      <Link href="/">
        <Button size="lg">
          Kembali ke Beranda
        </Button>
      </Link>
      
    </div>
  );
}