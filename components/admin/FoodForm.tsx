// components/admin/FoodForm.tsx
'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { addFood, updateFood, type FoodFormState } from '@/lib/actions/foodActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface Food {
  id?: string;
  name?: string;
  sugar_g?: number;
}

function SubmitButton({ isNew }: { isNew: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {pending ? 'Menyimpan...' : (isNew ? 'Buat Makanan' : 'Update Makanan')}
        </Button>
    )
}

export function FoodForm({ food }: { food?: Food }) {
    const action = food ? updateFood : addFood;
    const [state, formAction] = useActionState(action, { success: false });

    useEffect(() => {
        if (state.message) {
            state.success ? toast.success(state.message) : toast.error(state.message);
        }
    }, [state]);

    return (
        <form action={formAction} className="space-y-6">
            {food?.id && <input type="hidden" name="id" value={food.id} />}
            
            <div className="space-y-2">
                <Label htmlFor="name">Nama Makanan</Label>
                <Input id="name" name="name" defaultValue={food?.name} required placeholder="cth: Nasi Putih" />
                {state.errors?.name && <p className="text-destructive text-xs mt-1">{state.errors.name[0]}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="sugar_g">Kandungan Gula (gram)</Label>
                <Input id="sugar_g" name="sugar_g" type="number" step="0.1" defaultValue={food?.sugar_g} required placeholder="cth: 0.1" />
                {state.errors?.sugar_g && <p className="text-destructive text-xs mt-1">{state.errors.sugar_g[0]}</p>}
            </div>
            
            <div className="flex justify-end">
                <SubmitButton isNew={!food} />
            </div>
        </form>
    );
}