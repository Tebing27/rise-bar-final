// components/tracker/TrackerHeader.tsx
'use client';

import { useEffect, useState } from 'react';
import { Sun, CloudSun, CloudMoon, Moon } from 'lucide-react';
import Image from 'next/image';

interface TrackerHeaderProps {
  userName: string;
}

// --- PERBAIKAN DI SINI ---
// Fungsi untuk mendapatkan sapaan dan ikon berdasarkan 4 waktu
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 12) {
    return { text: 'Selamat Pagi', Icon: Sun };
  }
  if (hour >= 12 && hour < 15) {
    return { text: 'Selamat Siang', Icon: CloudSun };
  }
  if (hour >= 15 && hour < 19) {
    return { text: 'Selamat Sore', Icon: CloudMoon };
  }
  return { text: 'Selamat Malam', Icon: Moon };
};

export function TrackerHeader({ userName }: TrackerHeaderProps) {
  const [greeting, setGreeting] = useState(getGreeting());

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  const { text, Icon } = greeting;

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
          <Icon className="w-8 h-8 text-yellow-500" />
          {text}, {userName}!
          <Image
              src="/mascot_menyapa.webp" // Pastikan gambar ada di folder /public
              alt="Mascot Menyapa"
              width={80}
              height={80}
              // className="mb-6"
          />
        </h2>
        <p className="text-muted-foreground mt-1">
          Semoga harimu menyenangkan. Mari lihat progres kesehatanmu hari ini.
        </p>
      </div>
    </div>
  );
}