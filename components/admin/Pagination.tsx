'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const { replace } = useRouter();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="inline-flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => replace(createPageURL(currentPage - 1))}
        disabled={currentPage <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="ml-2">Sebelumnya</span>
      </Button>
      
      <span className="text-sm font-medium">
        Halaman {currentPage} dari {totalPages}
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={() => replace(createPageURL(currentPage + 1))}
        disabled={currentPage >= totalPages}
      >
        <span className="mr-2">Berikutnya</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}