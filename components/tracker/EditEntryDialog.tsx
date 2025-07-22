// components/tracker/EditEntryDialog.tsx
'use client';

import { useState, useEffect, useActionState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { updateTrackerEntry, searchFoods, type FoodItem, type GlucoseEntry, type FormState } from '@/lib/actions/trackerActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Pencil, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</> : 'Simpan Perubahan'}
    </Button>
  );
}

// Helper to parse food names with quantities
const parseFoodName = (name: string): FoodItem[] => {
  if (!name) return [];
  const foodItems: FoodItem[] = [];
  
  name.split(', ').forEach((foodString, index) => {
    const match = foodString.match(/(.+) \((\d+)x\)$/);
    if (match) {
      foodItems.push({ id: `${match[1]}-${index}`, name: match[1], quantity: parseInt(match[2], 10), sugar_g: 0 });
    } else {
      foodItems.push({ id: `${foodString}-${index}`, name: foodString, quantity: 1, sugar_g: 0 });
    }
  });
  return foodItems;
};


export default function EditEntryDialog({ entry }: { entry: GlucoseEntry }) {
  const [open, setOpen] = useState(false);
  const initialState: FormState = { success: undefined, error: undefined };

  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([]);
  const [totalSugar, setTotalSugar] = useState(entry.sugar_g);
  
  const [entryDate, setEntryDate] = useState('');
  const [entryTime, setEntryTime] = useState('');

  const hasModifiedFoods = useRef(false);

  useEffect(() => {
    if (open) {
      const localDate = new Date(entry.created_at);
      const date = [
        localDate.getFullYear(),
        ('0' + (localDate.getMonth() + 1)).slice(-2),
        ('0' + localDate.getDate()).slice(-2)
      ].join('-');
      const time = [
        ('0' + localDate.getHours()).slice(-2),
        ('0' + localDate.getMinutes()).slice(-2)
      ].join(':');

      setEntryDate(date);
      setEntryTime(time);

      setSelectedFoods(parseFoodName(entry.food_name));
      setTotalSugar(entry.sugar_g);
      hasModifiedFoods.current = false;
    }
  }, [open, entry]);
  
  useEffect(() => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    const debounceTimer = setTimeout(() => {
        const fetchFoods = async () => {
            const results = await searchFoods(query);
            setSearchResults(results);
        };
        fetchFoods();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);
  useEffect(() => {
    if (hasModifiedFoods.current) {
      const newTotal = selectedFoods.reduce((acc, food) => acc + (food.sugar_g * food.quantity), 0);
      setTotalSugar(newTotal);
    }
  }, [selectedFoods]);

  const addFoodToSelection = (food: FoodItem) => {
    hasModifiedFoods.current = true;
    setSelectedFoods(prevFoods => {
        const existingFood = prevFoods.find(f => f.name === food.name);
        if (existingFood) {
          return prevFoods.map(f => 
            f.name === food.name ? { ...f, quantity: f.quantity + 1, sugar_g: food.sugar_g } : f
          );
        } else {
          return [...prevFoods, { ...food, id: `${food.name}-${Date.now()}`, quantity: 1 }];
        }
      });
    setQuery('');
    setSearchResults([]);
  };

  const removeFoodFromSelection = (foodId: string) => {
    hasModifiedFoods.current = true;
    setSelectedFoods(prevFoods => {
        const foodToRemove = prevFoods.find(f => f.id === foodId);
        if (foodToRemove && foodToRemove.quantity > 1) {
            return prevFoods.map(f =>
                f.id === foodId ? { ...f, quantity: f.quantity - 1 } : f
            );
        } else {
            return prevFoods.filter(food => food.id !== foodId);
        }
    });
  };

const clientAction = async (prevState: FormState | null, formData: FormData) => {
    // Instead of creating new FormData from formData, just clone it
    const updatedFormData = new FormData();
    
    // Copy existing values
    for (const [key, value] of formData.entries()) {
        updatedFormData.set(key, value);
    }
    
    const finalFoodName = selectedFoods.map(f => 
        f.quantity > 1 ? `${f.name} (${f.quantity}x)` : f.name
    ).join(', ');
    
    updatedFormData.set('food_name', finalFoodName);
    updatedFormData.set('sugar_g', String(totalSugar));

    const result = await updateTrackerEntry(prevState, updatedFormData);
    if (result?.success) {
        toast.success(result.success);
        setOpen(false);
    } else if (result?.error) {
        toast.error(result.error);
    }
    return result;
};
  
  const [state, formAction] = useActionState(clientAction, initialState);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="w-3 h-3 mr-1" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Catatan Makanan</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="id" value={entry.id} />
          
          <div className="relative">
            <Label htmlFor="food_search_edit">Cari & Tambah Makanan</Label>
            <Input
              id="food_search_edit"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ketik nama makanan untuk menambah/mengganti..."
              autoComplete="off"
            />
            {searchResults.length > 0 && (
              <ul className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                {searchResults.map((food) => (
                  <li
                    key={food.id}
                    onClick={() => addFoodToSelection(food)}
                    className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    {food.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <Label>Makanan yang Dicatat</Label>
            {selectedFoods.length > 0 ? (
              <div className="mt-1 space-y-1 p-2 border rounded-md bg-gray-50 max-h-32 overflow-y-auto">
                {selectedFoods.map(food => (
                  <div key={food.id} className="flex justify-between items-center text-sm">
                    <span>
                      {food.name}
                      {food.quantity > 1 && <span className="text-gray-500 font-semibold"> ({food.quantity}x)</span>}
                    </span>
                    <Button type="button" variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => removeFoodFromSelection(food.id!)}>&times;</Button>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-gray-500 mt-1">Pilih makanan di atas.</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sugar_g_edit">Total Gula (g)</Label>
              <Input id="sugar_g_edit" name="sugar_g" type="number" step="0.1" value={totalSugar.toFixed(1)} readOnly className="bg-gray-100" />
            </div>
            <div>
              <Label htmlFor="age_at_input_edit">Usia (tahun)</Label>
              <Input id="age_at_input_edit" name="age_at_input" type="number" defaultValue={entry.age_at_input || ''} required />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="entry_date_edit">Tanggal</Label>
              <Input id="entry_date_edit" name="entry_date" type="date" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="entry_time_edit">Waktu</Label>
              <Input id="entry_time_edit" name="entry_time" type="time" value={entryTime} onChange={(e) => setEntryTime(e.target.value)} required />
            </div>
          </div>

          <div>
            <Label htmlFor="condition_edit">Kondisi</Label>
            <Select name="condition" defaultValue={entry.condition}>
              <SelectTrigger id="condition_edit">
                <SelectValue placeholder="Pilih kondisi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Setelah Makan">Setelah Makan</SelectItem>
                <SelectItem value="Sebelum Makan (Puasa)">Sebelum Makan (Puasa)</SelectItem>
                <SelectItem value="Sewaktu">Sewaktu</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Batal</Button>
            </DialogClose>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}