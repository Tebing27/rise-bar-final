// components/shared/Navbar.tsx - Modern Navigation
'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const userRole = session?.user?.role;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if user is in app area
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
    <header className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
      isScrolled 
        ? "bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm" 
        : "bg-transparent"
    )}>
      <nav className="container-modern">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient group-hover:scale-105 transition-transform">
                GlucoseTracker
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-all duration-200 hover:text-primary relative group',
                  pathname === link.href 
                    ? 'text-primary' 
                    : isScrolled 
                      ? 'text-foreground/80' 
                      : 'text-foreground/90'
                )}
              >
                {link.label}
                <span className={cn(
                  "absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full",
                  pathname === link.href && "w-full"
                )} />
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {status === 'loading' && (
              <div className="flex space-x-2">
                <div className="w-20 h-9 bg-muted/50 rounded-lg animate-pulse" />
                <div className="w-16 h-9 bg-muted/50 rounded-lg animate-pulse" />
              </div>
            )}
            
            {status === 'unauthenticated' && (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="btn-gradient">
                    Daftar Gratis
                  </Button>
                </Link>
              </>
            )}

            {status === 'authenticated' && (
              <>
                {isAppArea ? (
                  <Link href="/profile">
                    <Button size="sm" variant="ghost" className="hover:bg-primary/10">
                      Profil
                    </Button>
                  </Link>
                ) : (
                  <Link href={userRole === 'admin' ? '/admin' : '/tracker'}>
                    <Button size="sm" variant="ghost" className="hover:bg-primary/10">
                      Dashboard
                    </Button>
                  </Link>
                )}
                <LogoutButton />
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="hover:bg-primary/10"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-white/20 shadow-lg animate-fade-in">
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'block text-base font-medium transition-colors hover:text-primary',
                    pathname === link.href ? 'text-primary' : 'text-foreground/80'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-muted space-y-3">
                {status === 'unauthenticated' && (
                  <>
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start hover:bg-primary/10">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full btn-gradient">
                        Daftar Gratis
                      </Button>
                    </Link>
                  </>
                )}

                {status === 'authenticated' && (
                  <>
                    {isAppArea ? (
                      <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start hover:bg-primary/10">
                          Profil
                        </Button>
                      </Link>
                    ) : (
                      <Link href={userRole === 'admin' ? '/admin' : '/tracker'} onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start hover:bg-primary/10">
                          Dashboard
                        </Button>
                      </Link>
                    )}
                    <div onClick={() => setIsMobileMenuOpen(false)}>
                      <LogoutButton />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}