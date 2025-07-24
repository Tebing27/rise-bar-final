'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BarChart2, FileText, User } from 'lucide-react';
import { LogoutButton } from '../auth/LogoutButton';

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/tracker",
    icon: <BarChart2 className="w-5 h-5" />,
  },
  {
    title: "Laporan",
    href: "/reports",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    title: "Profil",
    href: "/profile",
    icon: <User className="w-5 h-5" />,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block w-64 flex-shrink-0 border-r bg-background">
      <div className="flex h-full flex-col justify-between p-4">
        <div>
          <div className="px-4 py-2 mb-4">
            <Link href="/" className="text-2xl font-bold text-primary">
              GlucoseTracker
            </Link>
          </div>
          <nav className="flex flex-col space-y-2">
            {sidebarNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-4 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted',
                  pathname === item.href && 'bg-muted text-primary font-semibold'
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-2">
            <LogoutButton />
        </div>
      </div>
    </aside>
  );
}