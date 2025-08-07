// components/shared/Navbar.tsx
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const userRole = session?.user?.role;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const logoUrl = "/logo.webp";
  const logoText = "Rice and Care";

  // Logika utama: Jika sedang di halaman admin, jangan render Navbar sama sekali.
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const isHomePage = pathname === "/";
  const blogHref = isHomePage ? "/#blog" : "/blog";

  // ✅ LOGIKA BARU: Tentukan tombol dashboard/profil berdasarkan lokasi saat ini
  const getDashboardButton = () => {
    // Jika user adalah admin, selalu tampilkan Dashboard Admin
    if (userRole === "admin") {
      return {
        href: "/admin",
        label: "Dashboard Admin",
      };
    }

    // Jika sedang di halaman tracker/dashboard, tampilkan tombol Profil
    if (pathname.startsWith("/tracker") || pathname === "/dashboard") {
      return {
        href: "/profile",
        label: "Profil",
      };
    }

    // Jika sedang di halaman profil, tampilkan tombol Dashboard
    if (pathname.startsWith("/profile")) {
      return {
        href: "/tracker",
        label: "Dashboard",
      };
    }

    // Default: tampilkan Dashboard untuk halaman lain
    return {
      href: "/tracker",
      label: "Dashboard",
    };
  };

  const publicLinks = [
    { href: "/", label: "Beranda" },
    ...(isHomePage ? [{ href: "/#about", label: "About" }] : []),
    { href: blogHref, label: "Blog" },
  ];

  // ✅ PERBAIKAN: Update authLinks untuk menggunakan logika dinamis
  const dashboardButton = getDashboardButton();
  const authLinks = [
    ...publicLinks,
    dashboardButton, // Menggunakan tombol dinamis
    // Hapus duplikasi profil karena sudah termasuk di dashboardButton
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 w-full bg-background/80 backdrop-blur-sm border-b z-50">
      <nav className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo & Brand Name */}
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={closeMobileMenu}
          >
            <Image
              src={logoUrl}
              alt="Rice and Care Logo"
              width={32}
              height={32}
              className="h-8 w-auto"
            />
            <span className="text-2xl font-bold text-primary">{logoText}</span>
          </Link>

          {/* Navigasi Desktop (Tampilan Besar) */}
          <div className="hidden md:flex items-center space-x-8">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium text-foreground/60 transition-colors hover:text-primary",
                  pathname === link.href && "text-primary"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Tombol Aksi Desktop (Tampilan Besar) */}
          <div className="hidden md:flex items-center space-x-2">
            {status === "loading" && (
              <div className="w-24 h-8 bg-muted rounded-md animate-pulse" />
            )}
            {status === "unauthenticated" && (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Daftar</Button>
                </Link>
              </>
            )}
            {status === "authenticated" && (
              <>
                {/* ✅ IMPLEMENTASI BARU: Gunakan tombol dinamis */}
                <Link href={dashboardButton.href}>
                  <Button
                    size="sm"
                    variant="ghost"
                    className={cn(
                      pathname === dashboardButton.href &&
                        "bg-muted text-primary"
                    )}
                  >
                    {dashboardButton.label}
                  </Button>
                </Link>
                <LogoutButton />
              </>
            )}
          </div>

          {/* Tombol Hamburger (Tampilan Mobile) */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
              <span className="sr-only">Buka Menu</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Menu Mobile (Dropdown) */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-background border-b shadow-lg animate-in fade-in-20">
          <div className="flex flex-col space-y-2 p-4">
            {session ? (
              <>
                {authLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className={cn(
                      "px-4 py-2 text-lg rounded-md text-muted-foreground hover:bg-muted hover:text-primary",
                      pathname === link.href &&
                        "bg-muted text-primary font-semibold"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 mt-2 border-t">
                  <LogoutButton />
                </div>
              </>
            ) : (
              <>
                {publicLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className="px-4 py-2 text-lg rounded-md text-muted-foreground hover:bg-muted hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex gap-2 pt-4 mt-2 border-t">
                  <Link
                    href="/login"
                    className="w-full"
                    onClick={closeMobileMenu}
                  >
                    <Button variant="ghost" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link
                    href="/register"
                    className="w-full"
                    onClick={closeMobileMenu}
                  >
                    <Button className="w-full">Daftar</Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
