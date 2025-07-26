'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

interface HeroProps {
  headline: string;
  subheadline: string;
  heroImageUrl: string;
  pillText: string;
}

export function Hero({ headline, subheadline, heroImageUrl, pillText }: HeroProps) {
  return (
    <section className="relative pt-15 pb-20 lg:pt-16 lg:pb-28 overflow-hidden bg-gradient-to-br from-primary/80 via-indigo-200/60 to-white animate-fade-in">
      <div className="absolute inset-0 bg-background pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left animate-in fade-in slide-in-from-top-8 duration-700">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 h-8 mb-5 text-sm font-semibold text-primary">
              {pillText}
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              {headline}
            </h1>
            <p className="mt-6 text-lg leading-8 text-foreground/60">
              {subheadline}
            </p>
            <div className="mt-10 flex items-center justify-center lg:justify-start gap-x-6">
              <Link href="/register">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-accent font-semibold px-8 py-6 shadow-lg transition-transform transform hover:scale-105">
                  Mulai Gratis
                </Button>
              </Link>
              <Link href="/#fitur" className="text-sm font-semibold leading-6 text-foreground transition-transform transform hover:scale-105">
                Lihat Fitur <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="flex justify-center animate-in fade-in slide-in-from-top-8 duration-700">
            <Image 
              src={heroImageUrl || "/risebar_hero.png"}
              alt="Glucose Tracker Illustration"
              width={1920}
              height={1080}
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={90}
              className="rounded-lg"
              priority
            />
          </div>
        </div>
      </div>

      {/* Bola Gradient Statis - Kiri Bawah */}
      <div
        className="absolute -bottom-10 -left-10 md:-bottom-20 md:-left-20 w-48 md:w-72 h-48 md:h-72 bg-green-200/50 rounded-full mix-blend-multiply filter blur-xl opacity-70"
      />

      {/* Bola Gradient Statis - Kanan Atas */}
      <div
        className="absolute -top-10 -right-10 md:-top-20 md:-right-20 w-48 md:w-72 h-48 md:h-72 bg-green-200/50 rounded-full mix-blend-multiply filter blur-xl opacity-70"
      />
    </section>
  );
}