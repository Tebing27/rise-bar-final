import { LogoForm } from "../../LogoForm";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { notFound } from "next/navigation";

async function getLogoById(id: string) {
  const { data } = await supabaseAdmin
    .from("brand_logos")
    .select("*")
    .eq("id", id)
    .single();
  if (!data) notFound();
  return data;
}

export default async function EditLogoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // Await params first
  const logo = await getLogoById(id);
  return <LogoForm logo={logo} />;
}
