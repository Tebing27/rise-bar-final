// components/tracker/EditEntryDialog.tsx
'use client';

import { useState, useEffect, useActionState } from 'react'; // <-- useRef dihapus dari sini
import { useFormStatus } from 'react-dom';
import { updateTrackerEntry, searchFoods, getFoodsByNames, type FoodItem, type GlucoseEntry, type FormState } from '@/lib/actions/trackerActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Pencil, Loader2, XIcon } from 'lucide-react';
import { toast } from 'sonner';

// Komponen SelectedFoodItem (tetap sama)
const SelectedFoodItem = ({ food, onRemove }: { food: FoodItem, onRemove: (id: string) => void }) => (
  <div className="flex items-center justify-between p-2 bg-secondary/10 rounded-md">
    <div className="flex flex-col">
      <span className="text-sm font-medium text-foreground">{food.name}</span>
      <span className="text-xs text-muted-foreground">
        {food.quantity} porsi x {food.sugar_g.toFixed(1)} g = <strong>{(food.sugar_g * food.quantity).toFixed(1)} g</strong>
      </span>
    </div>
    <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => onRemove(food.id)}>
      <XIcon className="w-4 h-4" />
    </Button>
  </div>
);

// Komponen SubmitButton (tetap sama)
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="bg-green-600 hover:bg-green-700">
      {pending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</> : 'Simpan Perubahan'}
    </Button>
  );
}

// Fungsi parseInitialFoodNames (tetap sama)
const parseInitialFoodNames = (name: string): Partial<FoodItem>[] => {
  if (!name) return [];
  return name.split(', ').map((foodString) => {
    const match = foodString.match(/(.+) \((\d+)x\)$/);
    if (match) {
      return { name: match[1], quantity: parseInt(match[2], 10) };
    }
    return { name: foodString, quantity: 1 };
  });
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

  useEffect(() => {
    if (open) {
      const localDate = new Date(entry.created_at);
      const date = [localDate.getFullYear(), ('0' + (localDate.getMonth() + 1)).slice(-2), ('0' + localDate.getDate()).slice(-2)].join('-');
      const time = [('0' + localDate.getHours()).slice(-2), ('0' + localDate.getMinutes()).slice(-2)].join(':');
      setEntryDate(date);
      setEntryTime(time);

      const initialFoods = parseInitialFoodNames(entry.food_name);
      const foodNames = initialFoods.map(f => f.name!);

      if (foodNames.length > 0) {
        getFoodsByNames(foodNames).then(fullFoodData => {
          const populatedFoods = initialFoods.map((initialFood, index) => {
            const foundData = fullFoodData.find(d => d.name === initialFood.name);
            return {
              id: foundData?.id || `${initialFood.name}-${index}`,
              name: initialFood.name!,
              quantity: initialFood.quantity!,
              sugar_g: foundData?.sugar_g || 0,
            };
          });
          setSelectedFoods(populatedFoods);
        });
      } else {
        setSelectedFoods([]);
      }
      setTotalSugar(entry.sugar_g);
    }
  }, [open, entry]);

  useEffect(() => {
    const newTotal = selectedFoods.reduce((acc, food) => acc + (food.sugar_g * food.quantity), 0);
    setTotalSugar(newTotal);
  }, [selectedFoods]);

  useEffect(() => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    const debounceTimer = setTimeout(() => {
      searchFoods(query).then(setSearchResults);
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const addFoodToSelection = (food: FoodItem) => {
    setSelectedFoods(prevFoods => {
      const existingFood = prevFoods.find(f => f.name === food.name);
      if (existingFood) {
        return prevFoods.map(f => 
          f.name === food.name ? { ...f, quantity: f.quantity + 1 } : f
        );
      }
      return [...prevFoods, { ...food, id: food.id || `${food.name}-${Date.now()}`, quantity: 1 }];
    });
    setQuery('');
    setSearchResults([]);
  };

  const removeFoodFromSelection = (foodId: string) => {
    setSelectedFoods(prevFoods => {
      const foodToRemove = prevFoods.find(f => f.id === foodId);
      if (foodToRemove && foodToRemove.quantity > 1) {
        return prevFoods.map(f =>
          f.id === foodId ? { ...f, quantity: f.quantity - 1 } : f
        );
      }
      return prevFoods.filter(food => food.id !== foodId);
    });
  };
  
  const clientAction = async (prevState: FormState | null, formData: FormData) => {
    const updatedFormData = new FormData();
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
  
  // ✅ Perbaikan: Tambahkan underscore pada 'state' untuk menandakan tidak terpakai
  const [, formAction] = useActionState(clientAction, initialState);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Catatan Makanan</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="id" value={entry.id} />
          
          <div className="relative">
            <Label htmlFor="food_search_edit" className='mb-4'>Cari & Tambah Makanan</Label>
            <Input
              id="food_search_edit"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ketik nama makanan..."
              autoComplete="off"
            />
            {searchResults.length > 0 && (
              <ul className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-48 overflow-y-auto">
                {searchResults.map((food) => (
                  <li
                    key={food.id}
                    onClick={() => addFoodToSelection(food)}
                    className="p-2 hover:bg-muted cursor-pointer text-sm"
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
              <div className="mt-2 space-y-2 p-3 border rounded-md max-h-40 overflow-y-auto">
                {selectedFoods.map(food => (
                  <SelectedFoodItem key={food.id} food={food} onRemove={removeFoodFromSelection} />
                ))}
              </div>
            ) : <p className="text-sm text-muted-foreground mt-2">Pilih makanan di atas.</p>}
          </div>
          
          <div>
              <Label htmlFor="sugar_g_edit" className='mb-2'>Total Gula (g)</Label>
              <Input id="sugar_g_edit" name="sugar_g" type="number" step="0.1" value={totalSugar.toFixed(1)} readOnly className="bg-muted mt-1" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="entry_date_edit" className='mb-2'>Tanggal</Label>
              <Input id="entry_date_edit" name="entry_date" type="date" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} required className="mt-1"/>
            </div>
            <div>
              <Label htmlFor="entry_time_edit" className='mb-2'>Waktu</Label>
              <Input id="entry_time_edit" name="entry_time" type="time" value={entryTime} onChange={(e) => setEntryTime(e.target.value)} required className="mt-1"/>
            </div>
          </div>

          <div>
            <Label htmlFor="condition_edit" className='mb-2'>Kondisi</Label>
            <Select name="condition" defaultValue={entry.condition}>
              <SelectTrigger id="condition_edit" className="mt-1">
                <SelectValue placeholder="Pilih kondisi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Setelah Makan">Setelah Makan</SelectItem>
                <SelectItem value="Sebelum Makan (Puasa)">Sebelum Makan (Puasa)</SelectItem>
                <SelectItem value="Sewaktu">Sewaktu</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="mood_edit" className='mb-2'>Perasaan Anda</Label>
            <Select name="mood" defaultValue={entry.mood || ''}>
              <SelectTrigger id="mood_edit" className="mt-1">
                <SelectValue placeholder="Pilih mood (opsional)..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Senang">😊 Senang</SelectItem>
                <SelectItem value="Biasa">😐 Biasa</SelectItem>
                <SelectItem value="Stres">😩 Stres</SelectItem>
                <SelectItem value="Lelah">😴 Lelah</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="activity_edit" className='mb-2'>Aktivitas Fisik</Label>
            <Input id="activity_edit" name="activity" defaultValue={entry.activity || ''} placeholder="cth: Jalan santai 30 menit" className="mt-1" />
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
