// components/home/Hero.tsx
'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

interface HeroProps {
  headline: string;
  subheadline: string;
}

export function Hero({ headline, subheadline }: HeroProps) {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-28">
      <div className="absolute inset-0 bg-background pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              {headline}
            </h1>
            <p className="mt-6 text-lg leading-8 text-foreground/60">
              {subheadline}
            </p>
            <div className="mt-10 flex items-center justify-center lg:justify-start gap-x-6">
              <Link href="/register">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-accent">
                  Mulai Gratis
                </Button>
              </Link>
              <Link href="/#fitur" className="text-sm font-semibold leading-6 text-foreground">
                Lihat Fitur <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
             {/* Ganti dengan gambar yang lebih profesional, misalnya ilustrasi */}
             <Image 
                src="/hero-image.png" // Anda perlu menambahkan gambar ini
                alt="Glucose Tracker Illustration"
                width={500}
                height={500}
                className="rounded-lg"
                priority
             />
          </div>
        </div>
      </div>
    </section>
  );
}