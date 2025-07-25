// components/shared/Hero.tsx - Modern Hero Section
'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Sparkles, Heart, TrendingUp } from 'lucide-react';

interface HeroProps {
  headline: string;
  subheadline: string;
}

export function Hero({ headline, subheadline }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Modern Background with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative container-modern">
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8 animate-scale-in">
            <Sparkles className="w-4 h-4" />
            Platform Kesehatan Terdepan
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-slide-up">
            <span className="text-gradient">{headline.split(' ').slice(0, 2).join(' ')}</span>
            <br />
            <span className="text-foreground">{headline.split(' ').slice(2).join(' ')}</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 max-w-3xl mx-auto animate-slide-up delay-200">
            {subheadline}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up delay-300">
            <Link href="/register">
              <Button size="lg" className="btn-gradient text-lg px-8 py-4 h-auto group">
                Mulai Gratis Sekarang
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/#fitur">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto border-2 hover:bg-primary/5">
                Lihat Fitur Lengkap
              </Button>
            </Link>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-slide-up delay-400">
            <div className="flex items-center justify-center gap-3 text-muted-foreground">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-foreground">Mudah Digunakan</div>
                <div className="text-sm">Interface yang intuitif</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-3 text-muted-foreground">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-foreground">Analisis Cerdas</div>
                <div className="text-sm">Wawasan berbasis AI</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-3 text-muted-foreground">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-foreground">Gratis Selamanya</div>
                <div className="text-sm">Tanpa biaya tersembunyi</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-muted-foreground/30 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}