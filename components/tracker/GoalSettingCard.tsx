// components/tracker/GoalSettingCard.tsx
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { upsertUserGoal } from '@/lib/actions/goalActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect } from 'react';
import { toast } from 'sonner';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Menyimpan...' : 'Simpan Target'}
    </Button>
  );
}

export function GoalSettingCard() {
  const [state, formAction] = useActionState(upsertUserGoal, null);

  useEffect(() => {
    if (state?.success) toast.success(state.success);
    if (state?.error) toast.error(state.error);
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atur Target Baru</CardTitle>
        <CardDescription>Menetapkan target membantu Anda tetap fokus pada tujuan kesehatan.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div>
            <Label htmlFor="target_type">Jenis Target</Label>
            <Select name="target_type" defaultValue="average_glucose">
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis target" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="average_glucose">Rata-rata Gula Darah</SelectItem>
                <SelectItem value="max_glucose">Gula Darah Maksimal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="target_value">Nilai Target (mg/dL)</Label>
            <Input id="target_value" name="target_value" type="number" placeholder="Contoh: 140" required />
            {state?.error && <p className="text-red-500 text-xs mt-1">{state.error}</p>}
          </div>
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
