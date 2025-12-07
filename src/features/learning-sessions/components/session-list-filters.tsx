import { Search, Filter, ListFilter, XCircle } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import type { SessionRetrieveParams } from '../types/session-manage.type';

interface SessionListFiltersProps {
  params: SessionRetrieveParams;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onClearFilters: () => void;
}

export const SessionListFilters = ({
  params,
  onSearchChange,
  onStatusChange,
  onSortChange,
  onClearFilters,
}: SessionListFiltersProps) => {
  // Check if any filter is active (excluding sort and pagination)
  const isFiltering = !!params.className || params.vrLearningSessionStatus !== undefined;

  return (
    <div className='bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between sticky top-0 z-10'>
      {/* Left: Search & Status */}
      <div className='flex flex-1 w-full md:w-auto gap-3'>
        <div className='relative flex-1 md:max-w-xs'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4' />
          <input
            type="text"
            placeholder="Tìm theo tên lớp..."
            className="h-10 w-full pl-9 pr-4 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            value={params.className || ''}
            onChange={onSearchChange}
          />
        </div>

        <div className='relative min-w-[140px]'>
          <Filter className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4' />
          <select
            className="h-10 w-full pl-9 pr-8 rounded-lg border border-slate-200 text-sm appearance-none bg-white focus:outline-none focus:border-primary cursor-pointer"
            value={params.vrLearningSessionStatus === undefined ? '' : params.vrLearningSessionStatus}
            onChange={onStatusChange}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="0">Hoàn thành</option>
            <option value="1">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Right: Sort & Clear */}
      <div className='flex w-full md:w-auto gap-3 items-center'>
        {isFiltering && (
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-red-500 hover:text-red-600 hover:bg-red-50 h-10">
            <XCircle size={16} className="mr-2" /> Xóa bộ lọc
          </Button>
        )}

        <div className='relative min-w-40'>
          <ListFilter className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4' />
          <select
            className="h-10 w-full pl-9 pr-8 rounded-lg border border-slate-200 text-sm appearance-none bg-white focus:outline-none focus:border-primary cursor-pointer"
            value={params.sortBy}
            onChange={onSortChange}
          >
            <option value="createdAtUtcDesc">Mới nhất trước</option>
            <option value="createdAtUtcAsc">Cũ nhất trước</option>
            <option value="classNameAsc">Tên lớp (A-Z)</option>
            <option value="classNameDesc">Tên lớp (Z-A)</option>
          </select>
        </div>
      </div>
    </div>
  );
};