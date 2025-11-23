'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/common/components/ui/button';
import { 
  Plus, 
  Loader2, 
} from 'lucide-react';
import { ConfirmDialog } from '../components/confirm-dialog';
import routes from '@/core/configs/routes';
import { CREATE_SESSION_CONFIRMATION } from '../constants';
import { useGetSessions } from '../hooks/useSession';
import { SessionItemCard } from '../components/session-item-card';
import Pagination from '@/common/components/pagination';
import type { SessionRetrieveParams } from '../types/session-manage.type';
import { SessionListFilters } from '../components/session-list-filters';
import { SessionListEmptyState } from '../components/session-list-empty';
import { useSelector } from 'react-redux';
import type { RootState } from '@/common/store';

export default function SessionListPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  // Initial State
  const initialParams: SessionRetrieveParams = {
    pageIndex: 1,
    pageSize: 9,
    isPaginated: true,
    sortBy: 'createdAtUtcDesc',
    teacherId: user?.userId || ''
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
  const isFiltering = !!params.className || params.vrLearningSessionStatus !== undefined;

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
        <SessionListFilters 
          params={params}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          onSortChange={handleSortChange}
          onClearFilters={clearFilters}
        />

        {/* --- CONTENT SECTION --- */}
        <div className='flex-1'>
          {isLoading ? (
            <div className='flex flex-col items-center justify-center h-64 w-full text-slate-400 gap-3'>
              <Loader2 className='h-10 w-10 animate-spin text-primary' />
              <p className="text-sm font-medium">Đang tải dữ liệu...</p>
            </div>
          ) : sessions.length === 0 ? (
            <SessionListEmptyState 
              isFiltering={isFiltering}
              onClearFilters={clearFilters}
              onCreateNew={() => setShowConfirmDialog(true)}
            />
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