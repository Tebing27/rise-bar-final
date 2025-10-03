import { LogoForm } from "../LogoForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewLogoPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link
        href="/admin/logos"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Daftar Logo
      </Link>
      <LogoForm />
    </div>
  );
}
