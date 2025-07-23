// components/admin/AdminSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Utensils, Mic, MessageSquareQuote, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Pengguna', icon: Users },
  { href: '/admin/foods', label: 'Makanan', icon: Utensils },
  { href: '/admin/blogs', label: 'Blog', icon: FileText },
  { href: '/admin/recommendations', label: 'Rekomendasi', icon: MessageSquareQuote },
  { href: '/admin/content', label: 'Konten', icon: Mic },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-card sm:flex">
      <nav className="flex flex-col items-start gap-2 px-4 py-4">
        <Link
          href="/admin"
          className="group flex h-9 w-full items-center justify-start rounded-lg px-3 mb-4"
        >
          <span className="text-lg font-bold text-primary">Admin Panel</span>
        </Link>
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex w-full items-center justify-start gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                isActive && 'bg-primary/10 text-primary'
              )}
            >
              <link.icon className="h-4 w-4" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}