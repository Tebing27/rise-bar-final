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
import { Tag, ArrowUpDown, Search as SearchIcon } from 'lucide-react'; // <-- Impor ikon Search

export function SearchAndFilter({ tags }: { tags: { name: string }[] }) {
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

  const handleFilterChange = (key: 'sortBy' | 'tag', value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-5 mb-8">
      {/* ✅ Kontainer untuk input pencarian */}
      <div className="relative flex-grow">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari artikel..."
          className="pl-9" // Tambahkan padding kiri untuk ikon
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get('search')?.toString()}
        />
      </div>
      
      <div className="flex gap-2">
        <Select
          onValueChange={(value) => handleFilterChange('tag', value)}
          defaultValue={searchParams.get('tag') || 'all'}
        >
          <SelectTrigger className="w-1/2 sm:w-[180px]">
            <div className="flex items-center gap-2 overflow-hidden">
              <Tag className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
              <span className="truncate">
                 <SelectValue placeholder="Semua Kategori" />
              </span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {tags.map((tag) => (
              <SelectItem key={tag.name} value={tag.name}>
                {tag.name.charAt(0).toUpperCase() + tag.name.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => handleFilterChange('sortBy', value)}
          defaultValue={searchParams.get('sortBy') || 'newest'}
        >
          <SelectTrigger className="w-1/2 sm:w-[180px]">
             <div className="flex items-center gap-2 overflow-hidden">
                <ArrowUpDown className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                <span className="truncate">
                    <SelectValue placeholder="Urutkan" />
                </span>
             </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Terbaru</SelectItem>
            <SelectItem value="popular">Terpopuler</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}