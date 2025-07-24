'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BarChart2, FileText, User, Menu, X } from 'lucide-react';
import { Button } from '../ui/button';
import { LogoutButton } from '../auth/LogoutButton';

const mobileNavItems = [
  { title: "Dashboard", href: "/tracker", icon: <BarChart2 className="w-5 h-5" /> },
  { title: "Laporan", href: "/reports", icon: <FileText className="w-5 h-5" /> },
  { title: "Profil", href: "/profile", icon: <User className="w-5 h-5" /> },
];

export function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="lg:hidden sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6">
      <Link href="/" className="text-xl font-bold text-primary">
        GlucoseTracker
      </Link>
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
        <Menu className="h-6 w-6" />
        <span className="sr-only">Buka Menu</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in-0" onClick={() => setIsOpen(false)}>
          <div className="fixed left-0 top-0 h-full w-4/5 max-w-sm border-r bg-background p-6 animate-in slide-in-from-left-full duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <Link href="/" className="text-xl font-bold text-primary">Menu</Link>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-6 w-6" />
                <span className="sr-only">Tutup Menu</span>
              </Button>
            </div>
            <nav className="mt-8 flex flex-col space-y-2">
              {mobileNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary text-lg',
                    pathname === item.href && 'text-primary font-semibold'
                  )}
                >
                  {item.icon}
                  {item.title}
                </Link>
              ))}
            </nav>
            <div className="absolute bottom-6 left-6 right-6">
                <LogoutButton />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}