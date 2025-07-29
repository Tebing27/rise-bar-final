// components/admin/AdminMobileHeader.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Users, Utensils, FileText, Settings, Menu, Package2, LayoutDashboard, Palette} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { LogoutButton } from '../auth/LogoutButton';

const adminNavItems = [
  { title: "Beranda", href: "/", icon: LayoutDashboard },
  { title: "Dashboard", href: "/admin", icon: Home },
  { title: "Pengguna", href: "/admin/users", icon: Users },
  { title: "Makanan", href: "/admin/foods", icon: Utensils },
  { title: "Blog", href: "/admin/blogs", icon: FileText },
  { title: "Rekomendasi", href: "/admin/recommendations", icon: Settings },
  { title: "Konten", href: "/admin/content", icon: Palette },
];

export function AdminMobileHeader() {
  const pathname = usePathname();

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:hidden">
      <Link href="/" className="flex items-center gap-2 font-semibold">
        <Package2 className="h-6 w-6 text-primary" />
        <span className="">Rise Bar</span>
      </Link>
      <div className="ml-auto">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          {/* ✅ PERBAIKAN: Tambahkan padding dan sesuaikan lebar */}
          <SheetContent side="left" className="pr-10">
            <SheetTitle className="sr-only">Admin Menu</SheetTitle>
            <SheetDescription className="sr-only">
              Navigasi utama untuk panel admin.
            </SheetDescription>
            
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="#"
                className="flex items-center gap-4 text-lg px-2.5 font-semibold mb-4 mt-5"
              >
                <Package2 className="h-6 w-6 text-primary" />
                <span>Admin Panel</span>
              </Link>
              {adminNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 px-2.5 text-muted-foreground hover:text-primary",
                    // ✅ PERBAIKAN: Ubah warna aktif menjadi text-primary (hijau)
                    pathname === item.href && "text-primary"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Link>
              ))}
            <div className="mt-auto px-2.5">
                <div className="border-t -mx-6 my-6"></div>
                <LogoutButton />
            </div>
            </nav>

          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
