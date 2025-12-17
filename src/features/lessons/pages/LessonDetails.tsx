'use client';

import { Link, useParams } from 'react-router-dom';
import { LessonDetailsHeader } from '../components/lesson-details-header';
import { VRLessonsList } from '../components/vr-lessons-list';
import { Button } from '@/common/components/ui/button';
import useGetLessonById from '../hooks/useGetLessonById';
import Loading from '@/common/components/loading';
import useGetVrLessons from '../hooks/useGetVrLessons';
import { ChevronLeft } from 'lucide-react';
import { useMemo } from 'react';

export default function LessonDetailsPage() {
  const params = useParams();
  const lessonId = params.id as string;
  const { data: lesson, isLoading: lessonLoading, isError: lessonError } = useGetLessonById({ lessonId });

  const { data: vrLessons, isLoading: vrLessonsLoading, isError: vrLessonsError } = useGetVrLessons({ lessonId });

  const filteredVrLessons = useMemo(() => {
    if (!vrLessons?.items) return [];
    return vrLessons.items.filter((v) => v.status.key === 1);
  }, [vrLessons]);

  const isLoading = lessonLoading || vrLessonsLoading;
  const isError = lessonError || vrLessonsError;
  console.log('error', isError);

  if (isLoading) return <Loading isLoading />;

  if (!lesson) {
    return (
      <div className='flex-1 flex h-full items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-neutral-900 mb-2'>Không tìm thấy bài giảng này</h2>
          <p className='text-neutral-600 mb-4'>Bài giảng bạn đang tìm không tồn tại.</p>
          <Link to='/'>
            <Button className='bg-primary text-white hover:bg-primary/90'>Quay lại</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='p-8 h-full overflow-y-auto'>
      <div className='max-w-4xl mx-auto py-4'>
        {/* Back Button */}
        <Link
          to='/'
          state={{ refresh: true }}
          className='inline-flex items-center gap-2 text-neutral-600 hover:text-primary mb-4 transition-colors hover:font-semibold'
        >
          <ChevronLeft />
          <span>Quay lại</span>
        </Link>

        <LessonDetailsHeader lesson={lesson} totalVrLessons={vrLessons?.items?.length} />

        <VRLessonsList vrLessons={filteredVrLessons} lesson={lesson} />
      </div>
    </div>
  );
}
