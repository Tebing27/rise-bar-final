import Image from "next/image";
import Link from "next/link";
import { getSiteContentAsMap } from "@/lib/content";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "#tentang-kami ", label: "Visi & Misi" },
  { href: "#visi-misi", label: "Perjalanan Kami" },
  { href: "#produk", label: "Tentang produk & Nutrition Facts" },
  { href: "#testimoni", label: "Testimoni" },
  { href: "/#kontak-kami", label: "Kontak" },
];

const FooterSection = async () => {
  const content = await getSiteContentAsMap();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link href="/" aria-label="Rise Bar Home">
              <Image
                src={content.footer_logo_url || "/logo.webp"}
                alt="Rise Bar Logo"
                width={160}
                height={33}
                className="h-8 w-auto"
              />
            </Link>
            <h3 className="text-xl font-semibold text-gray-900">RiseBar</h3>
          </div>

          <nav className="flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-700 hover:text-gray-900 transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile & Tablet Layout */}
        <div className="lg:hidden">
          {/* Logo Section */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <Link href="/" aria-label="Rise Bar Home">
              <Image
                src={content.footer_logo_url || "/logo.webp"}
                alt="Rise Bar Logo"
                width={160}
                height={33}
                className="h-8 w-auto"
              />
            </Link>
            <h3 className="text-xl font-semibold text-gray-900">RiseBar</h3>
          </div>

          {/* Navigation Links */}
          <nav className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-center text-gray-700 hover:text-gray-900 transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-6">
          {/* Copyright & Secondary Text */}
          {content.footer_secondary_text && (
            <p className="text-sm text-gray-500 text-center">
              &copy; {new Date().getFullYear()} {content.footer_secondary_text}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
