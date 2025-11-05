import { Button } from '@/common/components/ui/button';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({ currentPage, totalPages, onPageChange, className = '' }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* Previous */}
      <Button
        variant='outline'
        size='icon'
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeft className='w-4 h-4' />
      </Button>

      {/* Page numbers */}
      <div className='flex items-center gap-2'>
        {pages.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? 'default' : 'outline'}
            size='sm'
            onClick={() => onPageChange(page)}
            className={currentPage === page ? 'bg-secondary hover:bg-secondary/90' : ''}
          >
            {page}
          </Button>
        ))}
      </div>

      {/* Next */}
      <Button
        variant='outline'
        size='icon'
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className='w-4 h-4' />
      </Button>
    </div>
  );
}
