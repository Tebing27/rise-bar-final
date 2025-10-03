import { TestimonialForm } from "../../TestimonialForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { notFound } from "next/navigation";

async function getTestimonialById(id: string) {
  const { data } = await supabaseAdmin
    .from("testimonials")
    .select("*")
    .eq("id", id)
    .single();
  if (!data) notFound();
  return data;
}

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const testimonial = await getTestimonialById(id);

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit Testimoni</CardTitle>
          <CardDescription>
            Perbarui detail testimoni yang sudah ada.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TestimonialForm testimonial={testimonial} />
        </CardContent>
      </Card>
    </div>
  );
}
