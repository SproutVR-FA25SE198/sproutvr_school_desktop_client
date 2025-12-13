'use client';

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/common/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import routes from '@/core/configs/routes';
import { useGetSessions } from '../hooks/useSession';
import { SessionItemCard } from '../components/session-item-card';
import Pagination from '@/common/components/pagination';
import type { SessionRetrieveParams } from '../types/session-manage.type';
import { SessionListFilters } from '../components/session-list-filters';
import { SessionListEmptyState } from '../components/session-list-empty';
import { useSelector } from 'react-redux';
import type { RootState } from '@/common/store';
import type { VrLessonRetrieve } from '@/common/types/vr-lesson.type';
import { CreateLearningSessionDialog } from '@/common/components/create-learning-session-dialog';
import useGetVrLessons from '@/features/lessons/hooks/useGetVrLessons';
import Loading from '@/common/components/loading';
import useGetLessons from '@/features/lessons/hooks/useGetLessons';

export default function SessionListPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // --- DATA FETCHING ---
  const { data: vrLessonsData, isLoading: vrLessonsLoading } = useGetVrLessons({});

  const lessonQueryParams = {
    pageIndex: 1,
    pageSize: 50, 
    sortBy: 'nameAsc', 
    subjectId: '',
    teacherId: user?.userId
  };

  const { 
    data: userLessonsData, 
    isLoading: userLessonsLoading 
  } = useGetLessons({
    params: lessonQueryParams,
  });

  // Filter Logic
  const filteredVrLessons = useMemo(() => {
    if (!vrLessonsData?.items || !userLessonsData?.items) return [];

    const userLessonIds = new Set(userLessonsData.items.map((l) => l.id));
    var vrLessons = vrLessonsData.items.filter((vrLesson) => userLessonIds.has(vrLesson.lesson.id));
    
    return vrLessons.filter(v => v.status.key === 1); 
  }, [vrLessonsData, userLessonsData]);

  const handleConfirmCreate = (
    vrLessonId: string,
    vrLesson: VrLessonRetrieve,
    classroomNumber: string,
    classroomLetter: string,
  ) => {
    navigate(routes.vrSessionCreate, {
      state: { lessonId: vrLessonId, vrLesson, classroomNumber, classroomLetter },
    });
  };

  // --- SESSION LIST STATE ---
  const initialParams: SessionRetrieveParams = {
    pageIndex: 1,
    pageSize: 9,
    isPaginated: true,
    sortBy: 'createdAtUtcDesc',
    teacherId: user?.userId || '',
  };

  const [params, setParams] = useState<SessionRetrieveParams>(initialParams);
  const { data, isLoading } = useGetSessions(params); // isLoading here updates frequently
  
  const sessions = data?.items || [];
  const totalItems = data?.totalItems || 0;
  const totalPages = Math.ceil(totalItems / (params.pageSize || 9)) || 1;

  // Handlers
  const handlePageChange = (page: number) => setParams((prev) => ({ ...prev, pageIndex: page }));
  
  // Note: The Debounce logic is now inside SessionListFilters, so we just accept the value here
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setParams((prev) => ({ ...prev, className: e.target.value, pageIndex: 1 }));
    
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setParams((prev) => ({
      ...prev,
      vrLearningSessionStatus: value === '' ? undefined : Number(value),
      pageIndex: 1,
    }));
  };
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setParams((prev) => ({ ...prev, sortBy: e.target.value, pageIndex: 1 }));
    
  const clearFilters = () => setParams(initialParams);

  const isFiltering = !!params.className || params.vrLearningSessionStatus !== undefined;

  // --- 3. FIX: Only block full page for Initial Setup data, NOT for session list loading ---
  if (vrLessonsLoading || userLessonsLoading) {
    return <Loading isLoading />;
  }

  return (
    <div className='flex-1 h-full overflow-y-auto bg-slate-50/50 p-8'>
      <div className='max-w-7xl mx-auto flex flex-col min-h-[calc(100vh-4rem)] space-y-8'>
        
        {/* --- HEADER --- */}
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div>
            <h2 className='text-3xl font-bold text-slate-900 tracking-tight'>Danh sách phiên học</h2>
            <p className='text-slate-500 mt-1'>Quản lý phiên học VR và theo dõi tiến độ học sinh</p>
          </div>
          <Button
            className='bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all'
            onClick={() => setShowConfirmDialog(true)}
          >
            <Plus size={18} className='mr-2' />
            Tạo phiên học mới
          </Button>
        </div>

        {/* --- FILTERS (Always Mounted) --- */}
        <SessionListFilters
          params={params}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          onSortChange={handleSortChange}
          onClearFilters={clearFilters}
        />

        {/* --- LIST CONTENT (Loading handled internally) --- */}
        <div className='flex-1 relative min-h-[400px]'>
          
          {/* Optional: Overlay Loader when refetching */}
          {isLoading && sessions.length > 0 && (
             <div className="absolute inset-0 bg-slate-50/50 z-10 flex items-start justify-center pt-20 backdrop-blur-[1px]">
                 <Loader2 className='h-8 w-8 animate-spin text-primary' />
             </div>
          )}

          {isLoading && sessions.length === 0 ? (
            // Initial Load / No Data Load State
            <div className='flex flex-col items-center justify-center h-64 w-full text-slate-400 gap-3'>
              <Loader2 className='h-10 w-10 animate-spin text-primary' />
              <p className='text-sm font-medium'>Đang tải dữ liệu...</p>
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
          <div className='py-4 border-t border-slate-200 flex justify-center'>
            <Pagination currentPage={params.pageIndex} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        )}
      </div>

      {/* --- DIALOG --- */}
      <CreateLearningSessionDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        vrLessons={filteredVrLessons}
        onConfirm={handleConfirmCreate}
        confirmText='Tiếp tục'
        cancelText='Hủy'
      />
    </div>
  );
}