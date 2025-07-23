// components/home/CTA.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function CTA() {
  return (
    <div className="bg-background">
      <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="relative isolate overflow-hidden bg-primary/90 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
           <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Siap untuk memulai?
              <br />
              Mulai lacak kesehatan Anda hari ini.
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Buat akun gratis dan dapatkan akses penuh ke semua fitur kami untuk membantu Anda mencapai target kesehatan.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
               <Link href="/register">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 mb-5">
                  Daftar Sekarang
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}