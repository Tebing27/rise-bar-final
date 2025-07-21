'use client';

import { useState, useEffect, useActionState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { addMealEntry, searchFoods, FormState, FoodItem } from '@/lib/actions/trackerActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster, toast } from 'sonner';

// Tombol Submit dengan status loading
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Menyimpan...' : 'Simpan Catatan Makanan'}
    </Button>
  );
}

export default function TrackerForm() {
  const initialState: FormState | null = null;
  // Pastikan menggunakan addMealEntry, bukan addTrackerEntry
  const [state, formAction] = useActionState(addMealEntry, initialState); 

  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([]);

  // Menampilkan notifikasi dan mereset form setelah berhasil
  useEffect(() => {
    if (state?.error) toast.error(state.error);
    if (state?.success) {
      toast.success(state.success);
      setSelectedFoods([]); // Kosongkan keranjang makanan
      setQuery('');
    }
  }, [state]);

  // Mencari makanan saat pengguna mengetik
  useEffect(() => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    const fetchFoods = async () => {
      const results = await searchFoods(query);
      setSearchResults(results);
    };
    const debounce = setTimeout(() => fetchFoods(), 300);
    return () => clearTimeout(debounce);
  }, [query]);

  // Menambahkan makanan ke "keranjang"
const addFoodToSelection = (food: FoodItem) => {
  // Hindari duplikat
  // Ganti f._id menjadi f.id
  if (!selectedFoods.find(f => f.id === food.id)) { 
      setSelectedFoods([...selectedFoods, food]);
  }
  setQuery('');
  setSearchResults([]);
};

  // Menghapus makanan dari "keranjang"
  const removeFoodFromSelection = (foodId: string) => {
    setSelectedFoods(selectedFoods.filter(food => food.id !== foodId));
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      <form
        action={formAction}
        key={state?.success ? Date.now() : 'static-key'} // Reset form on success
        className="space-y-6 p-6 border rounded-lg bg-white shadow-sm"
      >
        {/* Input tersembunyi untuk mengirim data "keranjang" makanan */}
        <input
          type="hidden"
          name="foods_consumed"
          value={JSON.stringify(selectedFoods)}
        />

        {/* Bagian Pencarian Makanan */}
        <div className="relative">
          <Label htmlFor="food_search">Cari & Tambah Makanan</Label>
          <Input
            id="food_search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik nama makanan..."
            autoComplete="off"
          />
          {searchResults.length > 0 && (
            <ul className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map((food) => (
                <li
                  key={food.id}
                  onClick={() => addFoodToSelection(food)}
                  className="p-3 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  {food.name} 
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Daftar Makanan yang Dipilih ("Keranjang") */}
        <div>
            <Label>Makanan yang Akan Dicatat</Label>
            {selectedFoods.length > 0 ? (
                <div className="mt-2 space-y-2 p-3 border rounded-md bg-gray-50">
                    {selectedFoods.map(food => (
                        <div key={food.id} className="flex justify-between items-center text-sm">
                            <span>{food.name}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500">{food.sugar_g}g</span>
                                <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => removeFoodFromSelection(food.id)}>
                                    &times;
                                </Button>
                            </div>
                        </div>
                    ))}
                    <div className="border-t pt-2 mt-2 font-bold flex justify-between">
                        <span>Total Gula</span>
                        <span>{selectedFoods.reduce((acc, f) => acc + f.sugar_g, 0).toFixed(1)}g</span>
                    </div>
                </div>
            ) : (
                <p className="text-sm text-gray-500 mt-2">Belum ada makanan yang dipilih.</p>
            )}
        </div>

        {/* Input Tambahan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <Label htmlFor="user_age">Usia (tahun)</Label>
                <Input id="user_age" name="user_age" type="number" placeholder="Masukkan usia Anda" />
            </div>
            <div>
                <Label htmlFor="condition">Kondisi</Label>
                <Select name="condition" defaultValue="Setelah Makan">
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih kondisi" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Setelah Makan">Setelah Makan</SelectItem>
                        <SelectItem value="Sebelum Makan (Puasa)">Sebelum Makan (Puasa)</SelectItem>
                        <SelectItem value="Sewaktu">Sewaktu</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        <SubmitButton />
      </form>
    </>
  );
}
