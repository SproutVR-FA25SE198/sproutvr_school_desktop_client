'use client';

import { Link, useParams } from 'react-router-dom';
import { LessonDetailsHeader } from '../components/lesson-details-header';
import { VRLessonsList } from '../components/vr-lessons-list';
import { Button } from '@/common/components/ui/button';
import useGetLessonById from '../hooks/useGetLessonById';
import Loading from '@/common/components/loading';
import useGetVrLessons from '../hooks/useGetVrLessons';
import { ChevronLeft } from 'lucide-react';

export default function LessonDetailsPage() {
  const params = useParams();
  const lessonId = params.id as string;
  const { data: lesson, isLoading: lessonLoading, isError: lessonError } = useGetLessonById({ lessonId });

  const { data: vrLessons, isLoading: vrLessonsLoading, isError: vrLessonsError } = useGetVrLessons({ lessonId });

  const isLoading = lessonLoading || vrLessonsLoading;
  const isError = lessonError || vrLessonsError;
  console.log('error', isError);

  if (isLoading) return <Loading isLoading />;

  if (!lesson) {
    return (
      <div className='flex-1 flex items-center justify-center'>
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
    <div className='flex-1 overflow-y-auto'>
      <div className='max-w-4xl mx-auto py-4'>
        {/* Back Button */}
        <Link
          to='/'
          className='inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-4 transition-colors'
        >
          <ChevronLeft />
          <span>Quay lại</span>
        </Link>

        {/* Lesson Details */}
        <LessonDetailsHeader lesson={lesson} totalVrLessons={vrLessons?.items?.length} />

        <VRLessonsList vrLessons={vrLessons?.items} lesson={lesson} />

        {/* Open Folder Action
        <div className='mt-8 flex gap-3'>
          <Button variant='outline' className='border-neutral-300 bg-transparent'>
            Clear
          </Button>
          <Button className='bg-primary text-white hover:bg-primary/90'>Open this folder onClick</Button>
        </div> */}
      </div>
    </div>
  );
}
