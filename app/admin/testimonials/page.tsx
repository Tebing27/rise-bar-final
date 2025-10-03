// app/admin/testimonials/page.tsx
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteTestimonial } from "@/lib/actions/testimonialActions";
import { Star } from "lucide-react";
import Link from "next/link";

async function getTestimonials() {
  const { data } = await supabaseAdmin
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });
  return data || [];
}

export default async function AdminTestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <div className="grid gap-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Kelola Testimoni</h1>
          <p className="text-muted-foreground">
            Tambah, edit, atau hapus testimoni pelanggan.
          </p>
        </div>
        <Link href="/admin/testimonials/new">
          <Button>+ Tambah Testimoni</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Testimoni ({testimonials.length})</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="p-4 border rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-4">
                  <h3 className="font-semibold text-base">{item.author}</h3>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < item.stars ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
                <blockquote className="text-sm text-muted-foreground italic border-l-4 pl-4">
                  &ldquo;{item.quote}&ldquo;
                </blockquote>
                <p className="text-xs text-gray-500">{item.customer_since}</p>
              </div>
              <div className="flex gap-2 self-end sm:self-start flex-shrink-0">
                <Link href={`/admin/testimonials/edit/${item.id}`}>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
                <form action={deleteTestimonial}>
                  <input type="hidden" name="id" value={item.id} />
                  <Button variant="destructive" size="sm" type="submit">
                    Hapus
                  </Button>
                </form>
              </div>
            </div>
          ))}
          {testimonials.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Belum ada testimoni yang dibuat.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
