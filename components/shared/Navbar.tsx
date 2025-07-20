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

  const navLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/blog', label: 'Blog' },
    { href: '/#fitur', label: 'Fitur' },
  ];

  return (
    <header className="fixed w-full bg-background/80 backdrop-blur-sm border-b z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
                  'text-sm font-medium text-foreground/60 hover:text-primary transition-colors',
                  pathname === link.href && 'text-primary'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            {status === 'unauthenticated' && (
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
            )}
             {status === 'unauthenticated' && (
               <Link href="/register">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-accent">
                  Daftar
                </Button>
              </Link>
            )}
            {status === 'authenticated' && (
              <>
                <Link href="/tracker">
                  <Button size="sm" variant="ghost">Dashboard</Button>
                </Link>
                <LogoutButton />
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}