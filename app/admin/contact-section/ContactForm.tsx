"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  updateContactContent,
  type ContactFormState,
} from "@/lib/actions/contactActions";
import { getSiteContentAsMap } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {" "}
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Simpan
      Perubahan{" "}
    </Button>
  );
}

export function ContactForm() {
  const [content, setContent] = useState<Record<string, string> | null>(null);
  const initialState: ContactFormState = { success: false };
  const [state, formAction] = useActionState(
    updateContactContent,
    initialState
  );

  useEffect(() => {
    getSiteContentAsMap().then(setContent);
  }, []);

  useEffect(() => {
    if (state?.errors) {
      toast.error(Object.values(state.errors).flat().join("\n"));
    } else if (state?.message && !state.success) {
      toast.error(state.message);
    }
  }, [state]);

  if (!content) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-96 w-full bg-muted rounded-md animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editor Konten Kontak</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="contact_headline">Judul Utama</Label>
            <Input
              id="contact_headline"
              name="contact_headline"
              defaultValue={content.contact_headline}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_subheadline">Sub-Judul / Deskripsi</Label>
            <Textarea
              id="contact_subheadline"
              name="contact_subheadline"
              defaultValue={content.contact_subheadline}
              required
              rows={3}
            />
          </div>

          <hr />
          <h3 className="font-semibold text-lg">Detail Kontak</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_address">Alamat Kantor</Label>
              <Input
                id="contact_address"
                name="contact_address"
                defaultValue={content.contact_address}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_email">Email Kontak</Label>
              <Input
                id="contact_email"
                name="contact_email"
                type="email"
                defaultValue={content.contact_email}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_phone">Telepon/WhatsApp</Label>
              <Input
                id="contact_phone"
                name="contact_phone"
                defaultValue={content.contact_phone}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_map_url">URL Google Maps (Embed)</Label>
              <Input
                id="contact_map_url"
                name="contact_map_url"
                type="url"
                defaultValue={content.contact_map_url}
                required
              />
            </div>
          </div>

          <hr />
          <h3 className="font-semibold text-lg">Media Sosial</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="social_instagram_handle">
                Username Instagram
              </Label>
              <Input
                id="social_instagram_handle"
                name="social_instagram_handle"
                defaultValue={content.social_instagram_handle}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="social_instagram_link">Link Instagram</Label>
              <Input
                id="social_instagram_link"
                name="social_instagram_link"
                type="url"
                defaultValue={content.social_instagram_link}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="social_tiktok_handle">Username TikTok</Label>
              <Input
                id="social_tiktok_handle"
                name="social_tiktok_handle"
                defaultValue={content.social_tiktok_handle}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="social_tiktok_link">Link TikTok</Label>
              <Input
                id="social_tiktok_link"
                name="social_tiktok_link"
                type="url"
                defaultValue={content.social_tiktok_link}
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <SubmitButton />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
