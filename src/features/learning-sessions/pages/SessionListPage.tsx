'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/common/components/ui/button';
import { Card } from '@/common/components/ui/card';
import { Plus, Calendar, Loader2 } from 'lucide-react';
import { ConfirmDialog } from '../components/confirm-dialog';
import routes from '@/core/configs/routes';
import { CREATE_SESSION_CONFIRMATION } from '../constants';
import { useGetSessions } from '../hooks/useSession';
import { SessionItemCard } from '../components/session-item-card';
import Pagination from '@/common/components/pagination';

export default function SessionListPage() {
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  const [params, setParams] = useState({ 
    pageIndex: 1, 
    pageSize: 9, 
    isPaginated: true, 
    sortBy: 'createdAtUtcDesc',
    // TODO: get teacher ID from current logged in user
    teacherId: '0199f4b1-8487-4352-8a2a-320a00e40e58'
  });

  const { data, isLoading } = useGetSessions(params);
  
  // If data or items is undefined, fallback to an empty array []
  const sessions = data?.items || []; 

  const handlePageChange = (page: number) => {
    setParams(prev => ({ ...prev, pageIndex: page }));
  };

  const totalItems = data?.totalItems || 0;
  const totalPages = Math.ceil(totalItems / params.pageSize) || 1;

  return (
    <div className='flex-1 h-full overflow-y-auto bg-neutral-50/50 p-8'>
      <div className='max-w-7xl mx-auto flex flex-col min-h-[calc(100vh-4rem)]'>
        
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h2 className='text-3xl font-bold text-neutral-900 mb-2 tracking-tight'>Danh sách phiên học</h2>
            <p className='text-neutral-500'>Quản lý và theo dõi các lớp học thực tế ảo của bạn</p>
          </div>
          <Button className='bg-primary hover:bg-primary/90 shadow-md' onClick={() => setShowConfirmDialog(true)}>
            <Plus size={18} className='mr-2' /> Tạo phiên học mới
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className='flex flex-col items-center justify-center h-64 w-full text-neutral-500 gap-3'>
            <Loader2 className='h-8 w-8 animate-spin text-primary' />
            <p>Đang tải dữ liệu...</p>
          </div>
        )}

        {/* Empty State */}
        {/* Now we use 'sessions.length' which is safe */}
        {!isLoading && sessions.length === 0 && (
           <Card className='p-16 text-center border-dashed bg-transparent shadow-none'>
              <div className='flex flex-col items-center'>
                <div className='w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4 text-neutral-400'>
                  <Calendar size={32} />
                </div>
                <h3 className='text-xl font-medium text-neutral-900 mb-2'>Chưa có phiên học nào</h3>
                <Button variant='outline' onClick={() => setShowConfirmDialog(true)}>
                  <Plus size={16} className='mr-2' /> Tạo phiên học đầu tiên
                </Button>
              </div>
           </Card>
        )}

        {/* Data Grid */}
        {!isLoading && sessions.length > 0 && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
            {sessions.map((session) => (
              <SessionItemCard key={session.id} session={session} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && sessions.length > 0 && (
          <div className="mt-auto pt-6 border-t border-neutral-200 flex justify-center">
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