'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/common/components/ui/button';
import { Card } from '@/common/components/ui/card';
import { 
  Plus, 
  Calendar, 
  Loader2, 
  Search, 
  Filter, 
  ListFilter,
  XCircle
} from 'lucide-react';
import { ConfirmDialog } from '../components/confirm-dialog';
import routes from '@/core/configs/routes';
import { CREATE_SESSION_CONFIRMATION } from '../constants';
import { useGetSessions } from '../hooks/useSession';
import { SessionItemCard } from '../components/session-item-card';
import Pagination from '@/common/components/pagination';
import type { SessionRetrieveParams } from '../types/session-manage.type';

export default function SessionListPage() {
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  // Initial State
  const initialParams: SessionRetrieveParams = {
    pageIndex: 1,
    pageSize: 9,
    isPaginated: true,
    sortBy: 'createdAtUtcDesc',
    // TODO: get teacher ID from current logged in user
    teacherId: '0199f4b1-8487-4352-8a2a-320a00e40e58'
  };

  const [params, setParams] = useState<SessionRetrieveParams>(initialParams);
  
  // Fetch Data
  const { data, isLoading } = useGetSessions(params);
  const sessions = data?.items || [];
  const totalItems = data?.totalItems || 0;
  const totalPages = Math.ceil(totalItems / (params.pageSize || 9)) || 1;

  // Handlers
  const handlePageChange = (page: number) => {
    setParams(prev => ({ ...prev, pageIndex: page }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams(prev => ({ ...prev, className: e.target.value, pageIndex: 1 }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setParams(prev => ({ 
      ...prev, 
      // Convert string "1"/"0" to number, or undefined if empty
      vrLearningSessionStatus: value === '' ? undefined : Number(value),
      pageIndex: 1 
    }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setParams(prev => ({ ...prev, sortBy: e.target.value, pageIndex: 1 }));
  };

  const clearFilters = () => {
    setParams(initialParams);
  };

  // Check if any filter is active to show the "Clear" button
  const isFiltering = params.className || params.vrLearningSessionStatus !== undefined;

  return (
    <div className='flex-1 h-full overflow-y-auto bg-slate-50/50 p-8'>
      <div className='max-w-7xl mx-auto flex flex-col min-h-[calc(100vh-4rem)] space-y-8'>
        
        {/* --- HEADER SECTION --- */}
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div>
            <h2 className='text-3xl font-bold text-slate-900 tracking-tight'>
              Danh sách phiên học
            </h2>
            <p className='text-slate-500 mt-1'>
              Quản lý lớp học VR và theo dõi tiến độ học sinh
            </p>
          </div>
          <Button 
            className='bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all' 
            onClick={() => setShowConfirmDialog(true)}
          >
            <Plus size={18} className='mr-2' /> 
            Tạo phiên học mới
          </Button>
        </div>

        {/* --- FILTER BAR --- */}
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
                onChange={handleSearchChange}
              />
            </div>

            <div className='relative min-w-[140px]'>
              <Filter className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4' />
              <select 
                className="h-10 w-full pl-9 pr-8 rounded-lg border border-slate-200 text-sm appearance-none bg-white focus:outline-none focus:border-primary cursor-pointer"
                value={params.vrLearningSessionStatus === undefined ? '' : params.vrLearningSessionStatus}
                onChange={handleStatusChange}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="1">Đang diễn ra (Active)</option>
                <option value="0">Đã kết thúc (Completed)</option>
              </select>
            </div>
          </div>

          {/* Right: Sort & Clear */}
          <div className='flex w-full md:w-auto gap-3 items-center'>
            {isFiltering && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-red-500 hover:text-red-600 hover:bg-red-50 h-10">
                <XCircle size={16} className="mr-2" /> Xóa bộ lọc
              </Button>
            )}
            
            <div className='relative min-w-40'>
              <ListFilter className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4' />
              <select 
                className="h-10 w-full pl-9 pr-8 rounded-lg border border-slate-200 text-sm appearance-none bg-white focus:outline-none focus:border-primary cursor-pointer"
                value={params.sortBy}
                onChange={handleSortChange}
              >
                <option value="createdAtUtcDesc">Mới nhất trước</option>
                <option value="createdAtUtcAsc">Cũ nhất trước</option>
                <option value="classNameAsc">Tên lớp (A-Z)</option>
                <option value="classNameDesc">Tên lớp (Z-A)</option>
              </select>
            </div>
          </div>
        </div>

        {/* --- CONTENT SECTION --- */}
        <div className='flex-1'>
          {isLoading ? (
            <div className='flex flex-col items-center justify-center h-64 w-full text-slate-400 gap-3'>
              <Loader2 className='h-10 w-10 animate-spin text-primary' />
              <p className="text-sm font-medium">Đang tải dữ liệu...</p>
            </div>
          ) : sessions.length === 0 ? (
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
                  <Button variant='outline' onClick={clearFilters}>Xóa bộ lọc</Button>
                ) : (
                  <Button variant='default' onClick={() => setShowConfirmDialog(true)}>
                    <Plus size={16} className='mr-2' /> Tạo phiên học đầu tiên
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500'>
              {sessions.map((session) => (
                <SessionItemCard key={session.id} session={session} />
              ))}
            </div>
          )}
        </div>

        {/* --- PAGINATION --- */}
        {!isLoading && sessions.length > 0 && (
          <div className="py-4 border-t border-slate-200 flex justify-center">
            <Pagination 
              currentPage={params.pageIndex}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title={CREATE_SESSION_CONFIRMATION.title}
        question={CREATE_SESSION_CONFIRMATION.question}
        onConfirm={() => navigate(routes.vrSessionCreate)}
        confirmText='Tiếp tục'
        cancelText='Hủy'
      />
    </div>
  );
}