'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { addFood, updateFood, type FoodFormState } from '@/lib/actions/foodActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface Food {
  id?: string;
  name?: string;
  sugar_g?: number;
}

function SubmitButton({ isNew }: { isNew: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
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
            
            <div>
                <Label htmlFor="name">Nama Makanan</Label>
                <Input id="name" name="name" defaultValue={food?.name} required />
                {state.errors?.name && <p className="text-red-500 text-xs mt-1">{state.errors.name[0]}</p>}
            </div>

            <div>
                <Label htmlFor="sugar_g">Kandungan Gula (gram)</Label>
                <Input id="sugar_g" name="sugar_g" type="number" step="0.1" defaultValue={food?.sugar_g} required />
                {state.errors?.sugar_g && <p className="text-red-500 text-xs mt-1">{state.errors.sugar_g[0]}</p>}
            </div>
            
            <div className="text-right">
                <SubmitButton isNew={!food} />
            </div>
        </form>
    );
}