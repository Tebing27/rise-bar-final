// components/admin/AdminSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Users, Utensils, FileText, Settings, Package2, LayoutDashboard, Palette } from 'lucide-react';
import { LogoutButton } from '../auth/LogoutButton';
import { Button } from '@/components/ui/button';

const adminNavItems = [
  { title: "Beranda", href: "/", icon: LayoutDashboard },
  { title: "Dashboard", href: "/admin", icon: Home },
  { title: "Pengguna", href: "/admin/users", icon: Users },
  { title: "Makanan", href: "/admin/foods", icon: Utensils },
  { title: "Blog", href: "/admin/blogs", icon: FileText },
  { title: "Rekomendasi", href: "/admin/recommendations", icon: Settings },
  { title: "Konten", href: "/admin/content", icon: Palette },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    // ✅ Sembunyikan di mobile, tampilkan di desktop
    <aside className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6 text-primary" />
            <span className="">GlucoseTracker</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {adminNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  pathname === item.href && "bg-muted text-primary"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
              <div className="mt-auto px-2.5">
                <div className="border-t -mx-6 my-6"></div>
                <LogoutButton />
            </div>
          </nav>
          
        </div>
      </div>
    </aside>
  );
}