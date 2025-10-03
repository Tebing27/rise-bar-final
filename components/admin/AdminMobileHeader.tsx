"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  FileText,
  MessageSquareQuote,
  Menu,
  Package2,
  LayoutTemplate,
  Sparkles,
  GitMerge,
  SquarePen,
  Contact,
  ChevronsRightLeft,
  Anchor,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LogoutButton } from "../auth/LogoutButton";
import { useState } from "react";

const allNavItems = [
  { title: "Dashboard", href: "/admin", icon: Home },
  { title: "Pengguna", href: "/admin/users", icon: Users },
  { title: "Blog", href: "/admin/blogs", icon: FileText },
  { title: "Testimoni", href: "/admin/testimonials", icon: MessageSquareQuote },
  { title: "Logo Partner", href: "/admin/logos", icon: Sparkles },
  { isSeparator: true }, // Ini akan menjadi pemisah
  { title: "Halaman: Hero", href: "/admin/hero", icon: LayoutTemplate },
  { title: "Halaman: Tentang Kami", href: "/admin/about-section", icon: Users },
  {
    title: "Halaman: Perjalanan Kami",
    href: "/admin/how-it-works",
    icon: GitMerge,
  },
  {
    title: "Halaman: Cerita di Balik Bar",
    href: "/admin/cta-section",
    icon: SquarePen,
  },
  {
    title: "Halaman: Produk (Slider)",
    href: "/admin/product-section",
    icon: ChevronsRightLeft,
  },
  { title: "Halaman: Kontak", href: "/admin/contact-section", icon: Contact },
  { title: "Halaman: Footer", href: "/admin/footer-section", icon: Anchor },
];

export function AdminMobileHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:hidden">
      <Link href="/admin" className="flex items-center gap-2 font-semibold">
        <Package2 className="h-6 w-6 text-primary" />
        <span className="">Admin Panel</span>
      </Link>
      <div className="ml-auto">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <nav className="grid gap-6 text-base font-medium mt-8 px-4">
              {allNavItems.map((item, index) =>
                item.isSeparator ? (
                  <div key={index} className="my-2 border-t"></div>
                ) : (
                  <Link
                    key={item.title}
                    href={item.href!}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-4 text-muted-foreground hover:text-primary",
                      pathname === item.href! && "text-primary"
                    )}
                  >
                    {item.icon && <item.icon className="h-5 w-5" />}
                    {item.title}
                  </Link>
                )
              )}
              <div className="mt-auto pt-6 border-t">
                <LogoutButton />
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
