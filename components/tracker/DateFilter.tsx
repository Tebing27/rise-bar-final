// components/tracker/DateFilter.tsx
'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '../ui/label';

export function DateFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      params.set('filter', value);
    } else {
      params.delete('filter');
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (

    <div className="flex items-center gap-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50 dark:bg-gray-800">
        <Label htmlFor="date-filter" className="text-sm flex-shrink-0">Tampilkan:</Label>
        <Select
            onValueChange={handleFilterChange}
            defaultValue={searchParams.get('filter') || 'all'}
        >
            <SelectTrigger id="date-filter" className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter berdasarkan tanggal" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Semua Riwayat</SelectItem>
                <SelectItem value="today">Hari Ini</SelectItem>
                <SelectItem value="yesterday">Kemarin</SelectItem>
                <SelectItem value="last3days">3 Hari Terakhir</SelectItem>
                <SelectItem value="last7days">7 Hari Terakhir</SelectItem>
            </SelectContent>
        </Select>
    </div>
  );
}
