// app/(main)/blog/[slug]/page.tsx
import { db } from "@/lib/supabase";
import { notFound, redirect } from "next/navigation";

async function getPostAndRedirect(slug: string) {
  const { data: post, error } = await db
    .from("posts")
    .select("external_url")
    .eq("slug", slug)
    .single();

  if (error || !post || !post.external_url) {
    notFound();
  }

  // Lakukan redirect permanen ke URL eksternal
  redirect(post.external_url);
}

export default async function BlogRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>; // Changed to Promise
}) {
  const { slug } = await params; // Await params
  await getPostAndRedirect(slug);

  // Komponen ini tidak akan pernah di-render karena redirect terjadi di atas,
  // tapi Next.js memerlukan return value.
  return null;
}
