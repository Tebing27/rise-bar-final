"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import {
  updateBrandsHeadline,
  type HeadlineFormState,
} from "@/lib/actions/brandLogoActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="sm">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Simpan Judul
    </Button>
  );
}

export function HeadlineForm({ currentHeadline }: { currentHeadline: string }) {
  const initialState: HeadlineFormState = { success: false };
  const [state, formAction] = useActionState(
    updateBrandsHeadline,
    initialState
  );

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Judul Section</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex items-end gap-4">
          <div className="flex-grow space-y-2">
            <Label htmlFor="headline">Teks (cth: Dipercaya oleh:)</Label>
            <Input
              id="headline"
              name="headline"
              defaultValue={currentHeadline}
              required
            />
          </div>
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
