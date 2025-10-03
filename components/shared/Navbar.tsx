"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isOpen, setOpen] = useState(false);

  const logoUrl = "/logo.webp";
  const logoText = "Rise Bar";

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "#tentang-kami", label: "Tentang Kami" },
    { href: "#visi-misi", label: "Visi Misi" },
    { href: "#produk", label: "Produk & Filosofi Logo" },
    { href: "#testimoni", label: "Testimoni" },
    { href: "/blog", label: "Berita" },
    { href: "#kontak-kami", label: "Kontak Kami" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full p-4">
      <div className="mx-auto max-w-5xl">
        <nav className="relative flex w-full items-center justify-between rounded-xl bg-[rgb(var(--card-rgb)/0.5)] p-4 backdrop-blur-md md:flex-nowrap md:rounded-2xl">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 inline-flex items-center">
            <Image
              src={logoUrl}
              alt={logoText}
              width={120} // Lebih baik tentukan width dan height eksplisit
              height={32}
              className="h-8 w-auto" // Biarkan h-auto dan w-auto menyesuaikan
              priority
            />
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={
                    "relative text-sm font-medium transition-colors group"
                  }
                >
                  {link.label}
                  <span className="absolute bottom-[-2px] left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                </Link>
              );
            })}
          </div>

          {/* Tombol Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setOpen(!isOpen)}
              className="inline-flex p-2 rounded-md text-foreground"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Menu Mobile Wrapper (selalu render untuk animasi keluar) */}
          <div
            className={`md:hidden absolute top-full left-0 w-full mt-2 transition-all duration-300 ease-[var(--transition-smooth)] ${
              isOpen ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
          >
            <div className="rounded-lg bg-background/90 backdrop-blur-md shadow-lg">
              <div className="px-2 pt-2 pb-3 space-y-1 text-left">
                {navLinks.map((link) => {
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="relative block px-3 py-2 rounded-md text-base font-medium transition-colors group"
                    >
                      {link.label}
                      <span className="absolute bottom-[-2px] left-2.5 w-45 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
