// components/admin/AdminSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Users, Utensils, FileText, Settings, LogOut } from 'lucide-react';
import { LogoutButton } from '../auth/LogoutButton';

const adminNavItems = [
  { title: "Dashboard", href: "/admin", icon: <Home className="h-5 w-5" /> },
  { title: "Pengguna", href: "/admin/users", icon: <Users className="h-5 w-5" /> },
  { title: "Makanan", href: "/admin/foods", icon: <Utensils className="h-5 w-5" /> },
  { title: "Blog", href: "/admin/blogs", icon: <FileText className="h-5 w-5" /> },
  { title: "Rekomendasi", href: "/admin/recommendations", icon: <Settings className="h-5 w-5" /> },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden border-r bg-background lg:block w-64">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/admin" className="flex items-center gap-2 font-semibold">
            <span className="text-lg">Admin Panel</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            {adminNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  pathname === item.href && "bg-muted text-primary"
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
            <LogoutButton />
        </div>
      </div>
    </aside>
  );
}
