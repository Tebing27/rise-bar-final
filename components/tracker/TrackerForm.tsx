// components/tracker/TrackerForm.tsx
'use client';

import { useEffect, useState, useTransition } from 'react';
import { addFoodEntry } from '@/lib/actions/trackerActions';
import { searchFood } from '@/lib/actions/fatsecretActions';
import { useRouter } from 'next/navigation';

// SOLUSI: Definisikan tipe untuk data makanan dari API
interface FoodSuggestion {
  food_id: string;
  food_name: string;
  // Tambahkan properti lain jika Anda membutuhkannya dari API
}

export function TrackerForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState('');
  // SOLUSI: Terapkan tipe FoodSuggestion pada state
  const [foodList, setFoodList] = useState<FoodSuggestion[]>([]);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<FoodSuggestion[]>([]);

  useEffect(() => {
    console.log('🔍 DEBUG: userId received in TrackerForm:', userId);
  }, [userId]);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    const handler = setTimeout(async () => {
      const results = await searchFood(query);
      setSuggestions(results);
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  // SOLUSI: Beri tipe pada parameter 'food'
  const handleAddFoodToList = (food: FoodSuggestion) => {
    setFoodList(currentList => [...currentList, food]);
    setQuery('');
    setSuggestions([]);
  };

  const handleRemoveFood = (foodId: string) => {
    setFoodList(currentList => currentList.filter(f => f.food_id !== foodId));
  };

  const handleSubmit = (formData: FormData) => {
    setMessage('');
    startTransition(async () => {
      const result = await addFoodEntry({ success: false }, formData);
      if (result.success) {
        setMessage(result.message || 'Sukses!');
        setFoodList([]);
        router.refresh();
      } else {
        setMessage(result.message || 'Terjadi kesalahan.');
      }
    });
  };

  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Tambah Makanan Baru</h2>
      
      <div className="relative mb-4">
        <label htmlFor="foodName" className="block text-sm font-medium text-gray-700">Cari Makanan</label>
        <input
          type="text"
          id="foodName"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ketik nama makanan..."
          autoComplete="off"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto">
            {suggestions.map((food) => (
              <li key={food.food_id} onClick={() => handleAddFoodToList(food)} className="p-2 hover:bg-gray-100 cursor-pointer">
                {food.food_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <form action={handleSubmit}>
        <input type="hidden" name="userId" value={userId} />
        <div className="space-y-2 mb-4">
            {foodList.length === 0 && <p className="text-sm text-gray-500">Belum ada makanan yang dipilih.</p>}
            {foodList.map(food => (
                <div key={food.food_id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                    <span>{food.food_name}</span>
                    <button type="button" onClick={() => handleRemoveFood(food.food_id)} className="text-red-500 hover:text-red-700">
                        Hapus
                    </button>
                    <input type="hidden" name="foodIds" value={food.food_id} />
                    <input type="hidden" name="foodNames" value={food.food_name} />
                </div>
            ))}
        </div>
        
        <div className="text-right">
          <button
            type="submit"
            disabled={foodList.length === 0 || isPending}
            className="w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:bg-gray-400"
          >
            {isPending ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
        {message && <p className="text-sm mt-2 text-green-600">{message}</p>}
      </form>
    </div>
  );
}