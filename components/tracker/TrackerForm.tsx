// components/tracker/TrackerForm.tsx
'use client';

import { useState, useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { addMealEntry, searchFoods, FormState, FoodItem } from '@/lib/actions/trackerActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster, toast } from 'sonner';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Menyimpan...' : 'Simpan Catatan Makanan'}
    </Button>
  );
}

// Menghapus prop 'userAge' dari definisi komponen
export default function TrackerForm() {
  const initialState: FormState | null = null;
  const [state, formAction] = useActionState(addMealEntry, initialState); 

  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([]);
  
  const [entryDateTime, setEntryDateTime] = useState({ date: '', time: '' });

  useEffect(() => {
    if ((state as any)?.error) toast.error((state as any).error);
    if ((state as any)?.success) {
      toast.success((state as any).success);
      setSelectedFoods([]);
      setQuery('');
      setEntryDateTime({ date: '', time: '' });
    }
  }, [state]);

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
      const existingFood = prevFoods.find(f => f.id === food.id);
      if (existingFood) {
        return prevFoods.map(f => 
          f.id === food.id ? { ...f, quantity: f.quantity + 1 } : f
        );
      } else {
        return [...prevFoods, { ...food, quantity: 1 }];
      }
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
        } else {
            return prevFoods.filter(food => food.id !== foodId);
        }
    });
  };

  return (
    <>
      <form
        action={formAction}
        key={(state as any)?.success ? Date.now() : 'static-key'}
        className="space-y-6 mt-5"
      >
        <input type="hidden" name="foods_consumed" value={JSON.stringify(selectedFoods)} />
        
        <div className="relative">
          <Label htmlFor="food_search" className='mb-5'>Cari & Tambah Makanan</Label>
          <Input
            id="food_search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik nama makanan..."
            className='w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50 dark:bg-gray-800'
            autoComplete="off"
          />
          {searchResults.length > 0 && (
            <ul className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map((food) => (
                <li key={food.id} onClick={() => addFoodToSelection(food)} className="p-3 hover:bg-gray-100 cursor-pointer text-sm">
                  {food.name} 
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
            <Label>Makanan yang Akan Dicatat</Label>
            {selectedFoods.length > 0 ? (
                <div className="mt-2 space-y-2 p-3 border rounded-md bg-gray-50">
                    {selectedFoods.map(food => (
                        <div key={food.id} className="flex justify-between items-center text-sm">
                            <span>
                                {food.name}
                                {food.quantity > 1 && <span className="text-gray-500 font-semibold"> ({food.quantity}x)</span>}
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500">{(food.sugar_g * food.quantity).toFixed(1)}g</span>
                                <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => removeFoodFromSelection(food.id!)}>&times;</Button>
                            </div>
                        </div>
                    ))}
                    <div className="border-t pt-2 mt-2 font-bold flex justify-between">
                        <span>Total Gula</span>
                        <span>{selectedFoods.reduce((acc, f) => acc + (f.sugar_g * f.quantity), 0).toFixed(1)}g</span>
                    </div>
                </div>
            ) : (
                <p className="text-sm text-gray-500 mt-2">Belum ada makanan yang dipilih.</p>
            )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="entry_date" className='mb-5'>Tanggal</Label>
            <Input id="entry_date" name="entry_date" type="date" className='w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50 dark:bg-gray-800' value={entryDateTime.date} onChange={e => setEntryDateTime(prev => ({ ...prev, date: e.target.value }))} required />
          </div>
          <div>
            <Label htmlFor="entry_time" className='mb-5'>Waktu</Label>
            <Input id="entry_time" name="entry_time" type="time" className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50 dark:bg-gray-800" value={entryDateTime.time} onChange={e => setEntryDateTime(prev => ({ ...prev, time: e.target.value }))} required />
          </div>
        </div>

        {/* Input Usia sudah dihapus dari sini */}

        <div>
            <Label htmlFor="condition" className='mb-5'>Kondisi</Label>
            <Select name="condition" defaultValue="Setelah Makan">
                <SelectTrigger className='bg-card dark:bg-input'>
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
            <Label htmlFor="mood" className='mb-5'>Bagaimana perasaan Anda?</Label>
            <Select name="mood">
                <SelectTrigger className='bg-card dark:bg-input'>
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
            <Label htmlFor="activity" className='mb-5'>Aktivitas Fisik Hari Ini</Label>
            <Input id="activity" name="activity" type="text" placeholder="cth: Jalan santai 30 menit (opsional)" className='w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50 dark:bg-gray-800' />
        </div>

        <SubmitButton />
      </form>
    </>
  );
}
