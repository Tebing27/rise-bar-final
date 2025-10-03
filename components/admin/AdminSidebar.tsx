"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  FileText,
  MessageSquareQuote,
  LayoutTemplate,
  Sparkles,
  GitMerge,
  SquarePen,
  Contact,
  ChevronsRightLeft,
  Anchor,
} from "lucide-react";
import { LogoutButton } from "../auth/LogoutButton";

const adminNavItems = [
  { title: "Dashboard", href: "/admin", icon: Home },
  { title: "Blog", href: "/admin/blogs", icon: FileText },
  { title: "Testimoni", href: "/admin/testimonials", icon: MessageSquareQuote },
  { title: "Logo Partner", href: "/admin/logos", icon: Sparkles },
];

const pageContentNavItems = [
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

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/admin" className="flex items-center gap-2 font-semibold">
            <span className="">Rise Bar Admin</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {adminNavItems.map((item) => (
              <Link
                key={item.title}
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
            <div className="my-4 border-t"></div>
            <h3 className="px-3 py-2 text-xs font-semibold uppercase text-muted-foreground">
              Kelola Halaman
            </h3>
            {pageContentNavItems.map((item) => (
              <Link
                key={item.title}
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
          </nav>

          <div className="mt-auto border-t p-4">
            <LogoutButton />
          </div>
        </div>
      </div>
    </aside>
  );
}
