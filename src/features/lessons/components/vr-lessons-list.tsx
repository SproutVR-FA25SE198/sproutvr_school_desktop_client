'use client';

import type { Lesson } from '@/common/types/lesson.type';
import { usePagination } from '@/common/hooks/usePagination';
import Pagination from '@/common/components/pagination';
import { Button } from '@/common/components/ui/button';
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import routes from '@/core/configs/routes';

interface VRLessonsListProps {
  lesson: Lesson;
}

export function VRLessonsList({ lesson }: VRLessonsListProps) {
  // Generate mock VR lesson cards
  const vrLessons = Array.from({ length: lesson.vrLessonCount || 1 }, (_, i) => ({
    id: `vr-${i + 1}`,
    title: `VR Lesson ${i + 1}`,
    image: `/placeholder.svg?height=240&width=280&query=vr lesson`,
  }));

  const navigate = useNavigate();

  const itemsPerView = 3;
  const { currentData, currentPage, setPage, totalPages } = usePagination(vrLessons, itemsPerView);

  return (
    <div className='bg-white rounded-lg p-6'>
      <div className='flex items-center justify-between mb-0'>
        <h2 className='text-xl font-semibold text-neutral-900 mb-4'>VR Lessons ({lesson.vrLessonCount})</h2>
        <Button variant='secondary' size='sm' onClick={() => navigate(routes.vrLessonDesign)}>
          <BookOpen /> Tạo bài học VR
        </Button>
      </div>
      <div className='flex items-center mb-6'>
        <div className='flex gap-8 transition-transform duration-300'>
          {currentData.map((vrLesson) => (
            <div
              key={vrLesson.id}
              className='flex-shrink-0 shadow-md w-64 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-shadow'
            >
              <img
                src={vrLesson.image || '/placeholder.svg'}
                alt={vrLesson.title}
                className='w-full h-40 object-cover'
              />
              <div className='bg-neutral-50 p-3'>
                <p className='text-sm font-medium text-neutral-900'>{vrLesson.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
