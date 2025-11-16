'use client';

import { useState } from 'react';
import { usePagination } from '@/common/hooks/usePagination';
import Pagination from '@/common/components/pagination';
import { Button } from '@/common/components/ui/button';
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import routes from '@/core/configs/routes';
import { ConfirmDialog } from '@/features/learning-sessions/components/confirm-dialog';
import { CREATE_SESSION_CONFIRMATION } from '@/features/learning-sessions/constants';
import type { LessonRetrieve } from '../services/lesson.service';
import type { VrLessonRetrieve } from '@/common/types/vr-lesson.type';

interface VRLessonsListProps {
  vrLessons?: VrLessonRetrieve[];
  lesson?: LessonRetrieve;
}

export function VRLessonsList({ vrLessons, lesson }: VRLessonsListProps) {
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleOpenVrClassroom = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmCreate = () => {
    navigate(routes.vrSessionCreate, {
      state: { lessonId: lesson?.id },
    });
  };

  const itemsPerView = 3;
  const { currentData, currentPage, setPage, totalPages } = usePagination(vrLessons || [], itemsPerView);

  return (
    <div className='bg-white rounded-lg p-6'>
      <div className='flex items-center justify-between mb-0'>
        <h2 className='text-xl font-semibold text-neutral-900 mb-4'>Bài học VR ({vrLessons?.length || 0})</h2>
        <Button variant='secondary' size='sm' onClick={handleOpenVrClassroom}>
          <BookOpen /> Mở phòng học
        </Button>
        <Button variant='default' size='sm' onClick={() => navigate(routes.vrLessonDesign, { state: { lesson } })}>
          <BookOpen /> Tạo bài học VR
        </Button>
      </div>
      <div className='flex items-center mb-6'>
        <div className={`flex gap-8 transition-transform duration-300 ${currentData.length === 0 ? 'm-auto' : ''}`}>
          {currentData.length !== 0 ? (
            currentData.map((vrLesson) => (
              <div
                key={vrLesson.id}
                className='flex-shrink-0 shadow-md w-64 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-shadow'
              >
                <img
                  src={vrLesson.map.imageUrl || '/placeholder.svg'}
                  alt={vrLesson.name}
                  className='w-full h-40 object-cover'
                />
                <div className='bg-neutral-50 p-3'>
                  <p className='text-sm font-medium text-neutral-900'>{vrLesson.name}</p>
                </div>
              </div>
            ))
          ) : (
            <div className='items-center w-full justify-center p-10'>
              <p className='text-neutral-500 self-center text-center'>Chưa có bài học VR nào.</p>
            </div>
          )}
        </div>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />

      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title={CREATE_SESSION_CONFIRMATION.title}
        message={CREATE_SESSION_CONFIRMATION.message}
        question={CREATE_SESSION_CONFIRMATION.question}
        onConfirm={handleConfirmCreate}
        confirmText='Tiếp tục'
        cancelText='Hủy'
      />
    </div>
  );
}
