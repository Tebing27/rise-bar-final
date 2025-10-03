import Image from "next/image";
import Link from "next/link";
import { getSiteContentAsMap } from "@/lib/content";

const navLinks = [
  { href: "#", label: "Beranda" },
  { href: "/#tentang-kami", label: "Tentang Kami" },
  { href: "/#visi-misi", label: "Visi Misi" },
  { href: "/#produk", label: "Produk & Filosofi Logo" },
  { href: "/#testimoni", label: "Testimoni" },
  { href: "/#produk", label: "Produk" },
  { href: "/#kontak-kami", label: "Kontak" },
];

const FooterSection = async () => {
  const content = await getSiteContentAsMap();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="relative flex items-center justify-between">
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link href="/" aria-label="Rise Bar Home">
              <Image
                src={content.footer_logo_url || "/logo.webp"}
                alt="Rise Bar Logo"
                width={160}
                height={33}
                className="h-8 w-auto"
              />
            </Link>
            <h3>RiseBar</h3>
          </div>
          <nav className="absolute left-1/3 hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-base text-gray-900 hover:text-gray-700 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          {/* <div className="flex items-center">
            {content.footer_cta_text && (
              <Link
                href={content.footer_cta_link || "#"}
                className="hidden lg:inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-5 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
              >
                {content.footer_cta_text}
              </Link>
            )}
          </div> */}
        </div>
        {content.footer_secondary_text && (
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-500">
              &copy; {new Date().getFullYear()} {content.footer_secondary_text}
            </p>
          </div>
        )}
      </div>
    </footer>
  );
};

export default FooterSection;
