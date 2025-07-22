// components/blog/SearchAndFilter.tsx
'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function SearchAndFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    params.set('sortBy', value);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <Input
        placeholder="Cari artikel..."
        className="flex-grow"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('search')?.toString()}
      />
      <Select
        onValueChange={handleSortChange}
        defaultValue={searchParams.get('sortBy') || 'newest'}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Urutkan berdasarkan" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Terbaru</SelectItem>
          <SelectItem value="popular">Terpopuler</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}