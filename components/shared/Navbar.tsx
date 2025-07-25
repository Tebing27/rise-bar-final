// components/shared/Navbar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const userRole = session?.user?.role;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Cek apakah sedang berada di halaman Beranda
  const isHomePage = pathname === '/';
  
  // ✅ Cek apakah pengguna berada di area aplikasi utama (dashboard)
  const isAppArea = pathname.startsWith('/tracker') || pathname.startsWith('/profile');

  const blogHref = isHomePage ? '/#blog' : '/blog';

  // Link untuk Publik (Belum Login)
  const publicLinks = [
    { href: '/', label: 'Beranda' },
    { href: blogHref, label: 'Blog' },
    ...(isHomePage ? [{ href: '/#fitur', label: 'Fitur' }] : []),
  ];

  // Link untuk Pengguna (Sudah Login)
  const authLinks = [
    { href: '/', label: 'Beranda' },
    { href: blogHref, label: 'Blog' },
    ...(isHomePage ? [{ href: '/#fitur', label: 'Fitur' }] : []),
    { href: '/tracker', label: 'Dashboard' },
    { href: '/profile', label: 'Profil' },
  ];
  
  if (pathname.startsWith('/admin')) {
    return null;
  }
  
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 w-full bg-background/80 backdrop-blur-sm border-b z-50">
      <nav className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-primary" onClick={closeMobileMenu}>
              GlucoseTracker
            </Link>
          </div>

          {/* Navigasi Desktop (Tampilan Besar) */}
          <div className="hidden md:flex items-center space-x-8">
             {/* Selalu tampilkan link publik di desktop untuk konsistensi */}
             {publicLinks.map((link) => (
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

          {/* Tombol Aksi Desktop (Tampilan Besar) */}
          <div className="hidden md:flex items-center space-x-2">
            {status === 'loading' && <div className="w-24 h-8 bg-muted rounded-md animate-pulse" />}
            {status === 'unauthenticated' && (
              <>
                <Link href="/login"><Button variant="ghost" size="sm">Login</Button></Link>
                <Link href="/register"><Button size="sm">Daftar</Button></Link>
              </>
            )}
            {status === 'authenticated' && (
              <>
                {/* ✅ LOGIKA BARU DI SINI */}
                {isAppArea ? (
                  // Jika di halaman tracker/profil, tampilkan tombol Profil
                  <Link href="/profile">
                    <Button size="sm" variant="ghost">Profil</Button>
                  </Link>
                ) : (
                  // Jika di halaman lain (Beranda), tampilkan tombol Dashboard
                  <Link href={userRole === 'admin' ? '/admin' : '/tracker'}>
                    <Button size="sm" variant="ghost">Dashboard</Button>
                  </Link>
                )}
                <LogoutButton />
              </>
            )}
          </div>

          {/* Tombol Hamburger (Tampilan Mobile) */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">Buka Menu</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Menu Mobile (Dropdown) */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-background border-b shadow-lg animate-in fade-in-20">
          <div className="flex flex-col space-y-2 p-4">
            {status === 'authenticated' ? (
              // --- Menu saat sudah login ---
              <>
                {authLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className={cn(
                      'px-4 py-2 text-lg rounded-md text-muted-foreground hover:bg-muted hover:text-primary',
                      pathname === link.href && 'bg-muted text-primary font-semibold'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 mt-2 border-t">
                  <LogoutButton />
                </div>
              </>
            ) : (
              // --- Menu saat belum login ---
              <>
                {publicLinks.map(link => (
                   <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className="px-4 py-2 text-lg rounded-md text-muted-foreground hover:bg-muted hover:text-primary"
                  >
                    {link.label}
                   </Link>
                ))}
                <div className="flex gap-2 pt-4 mt-2 border-t">
                  <Link href="/login" className="w-full" onClick={closeMobileMenu}>
                    <Button variant="ghost" className="w-full">Login</Button>
                  </Link>
                  <Link href="/register" className="w-full" onClick={closeMobileMenu}>
                    <Button className="w-full">Daftar</Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}