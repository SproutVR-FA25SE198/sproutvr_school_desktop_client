import { Card } from '@/common/components/ui/card';
import { Button } from '@/common/components/ui/button';
import { Calendar, Plus } from 'lucide-react';

interface SessionListEmptyStateProps {
  isFiltering: boolean;
  onClearFilters: () => void;
  onCreateNew: () => void;
}

export const SessionListEmptyState = ({ isFiltering, onClearFilters, onCreateNew }: SessionListEmptyStateProps) => {
  return (
    <Card className='p-16 text-center border-dashed border-2 border-slate-200 bg-slate-50/50 shadow-none'>
      <div className='flex flex-col items-center'>
        <div className='w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100'>
          <Calendar size={32} className="text-slate-400" />
        </div>
        <h3 className='text-xl font-semibold text-slate-900 mb-2'>
          {isFiltering ? 'Không tìm thấy kết quả' : 'Chưa có phiên học nào'}
        </h3>
        <p className="text-slate-500 mb-6 max-w-sm mx-auto">
          {isFiltering
            ? 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc trạng thái.'
            : 'Bắt đầu bằng cách tạo phiên học VR đầu tiên cho học sinh của bạn.'}
        </p>
        {isFiltering ? (
          <Button variant='outline' onClick={onClearFilters}>Xóa bộ lọc</Button>
        ) : (
          <Button variant='default' onClick={onCreateNew}>
            <Plus size={16} className='mr-2' /> Tạo phiên học đầu tiên
          </Button>
        )}
      </div>
    </Card>
  );
};