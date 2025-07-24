// components/shared/Navbar.tsx
'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const userRole = session?.user?.role;

  // Cek apakah pengguna berada di dalam area aplikasi utama (dasbor)
  const isAppArea = pathname.startsWith('/tracker') || pathname.startsWith('/reports') || pathname.startsWith('/profile');

  const navLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/blog', label: 'Blog' },
    { href: '/#fitur', label: 'Fitur' },
  ];

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="sticky top-0 w-full bg-background/80 backdrop-blur-sm border-b z-50">
      <nav className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-primary">
              GlucoseTracker
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium text-foreground/60 transition-colors hover:text-primary',
                  pathname === link.href && 'text-primary'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            {status === 'loading' && <div className="w-24 h-8 bg-muted rounded-md animate-pulse" />}
            
            {status === 'unauthenticated' && (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Daftar</Button>
                </Link>
              </>
            )}

            {status === 'authenticated' && (
              <>
                {/* --- LOGIKA DINAMIS DI SINI --- */}
                {isAppArea ? (
                  // Jika di dalam dasbor, tampilkan tombol Profil
                  <Link href="/profile">
                    <Button size="sm" variant="ghost">Profil</Button>
                  </Link>
                ) : (
                  // Jika di halaman lain (spt homepage), tampilkan tombol Dashboard
                  <Link href={userRole === 'admin' ? '/admin' : '/tracker'}>
                    <Button size="sm" variant="ghost">Dashboard</Button>
                  </Link>
                )}
                <LogoutButton />
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}