"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  upsertTestimonial,
  type TestimonialFormState,
} from "@/lib/actions/testimonialActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface Testimonial {
  id?: string;
  quote?: string;
  author?: string;
  initials?: string;
  customer_since?: string;
  stars?: number;
}

function SubmitButton({ isNew }: { isNew: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? "Menyimpan..." : isNew ? "Buat Testimoni" : "Update Testimoni"}
    </Button>
  );
}

export function TestimonialForm({
  testimonial,
}: {
  testimonial?: Testimonial;
}) {
  const initialState: TestimonialFormState = { success: false };
  const [state, formAction] = useActionState(upsertTestimonial, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="id" value={testimonial?.id || ""} />

      <div className="space-y-2">
        <Label htmlFor="quote">Kutipan (Quote)</Label>
        <Textarea
          id="quote"
          name="quote"
          defaultValue={testimonial?.quote}
          required
          placeholder="Tulis kutipan testimoni di sini..."
        />
        {state.errors?.quote && (
          <p className="text-destructive text-xs mt-1">
            {state.errors.quote[0]}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="author">Nama Author</Label>
          <Input
            id="author"
            name="author"
            defaultValue={testimonial?.author}
            required
            placeholder="cth: John Doe"
          />
          {state.errors?.author && (
            <p className="text-destructive text-xs mt-1">
              {state.errors.author[0]}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="initials">Inisial</Label>
          <Input
            id="initials"
            name="initials"
            defaultValue={testimonial?.initials}
            required
            placeholder="cth: JD"
            maxLength={3}
          />
          {state.errors?.initials && (
            <p className="text-destructive text-xs mt-1">
              {state.errors.initials[0]}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customer_since">Pelanggan Sejak</Label>
          <Input
            id="customer_since"
            name="customer_since"
            defaultValue={testimonial?.customer_since}
            placeholder="cth: Pelanggan sejak 2021"
          />
          {state.errors?.customer_since && (
            <p className="text-destructive text-xs mt-1">
              {state.errors.customer_since[0]}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="stars">Rating (Bintang)</Label>
          <Select
            name="stars"
            defaultValue={testimonial?.stars?.toString() || "5"}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 Bintang</SelectItem>
              <SelectItem value="4">4 Bintang</SelectItem>
              <SelectItem value="3">3 Bintang</SelectItem>
              <SelectItem value="2">2 Bintang</SelectItem>
              <SelectItem value="1">1 Bintang</SelectItem>
            </SelectContent>
          </Select>
          {state.errors?.stars && (
            <p className="text-destructive text-xs mt-1">
              {state.errors.stars[0]}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-2 gap-2">
        <Link href="/admin/testimonials">
          <Button type="button" variant="outline">
            Batal
          </Button>
        </Link>
        <SubmitButton isNew={!testimonial} />
      </div>
      {state.message && !state.success && (
        <p className="text-destructive text-sm mt-2">{state.message}</p>
      )}
    </form>
  );
}
