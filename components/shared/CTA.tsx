// components/shared/CTA.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface CTAProps {
  headline: string;
  subheadline: string;
  buttonText: string;
}

export function CTA({ headline, subheadline, buttonText }: CTAProps) {
  return (
    <section className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden bg-muted/50 px-6 py-24 text-center shadow-sm rounded-3xl border">
          
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {headline}
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
            {subheadline}
          </p>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-accent rounded-md font-semibold px-8 py-4 text-base shadow-lg transition-transform transform hover:scale-105"
              >
                {buttonText}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}