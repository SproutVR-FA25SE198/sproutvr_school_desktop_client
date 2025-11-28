'use client';

import { Button } from '@/common/components/ui/button';
import { Link, useParams } from 'react-router-dom';
import { VrLessonDetails } from '../components/vr-lesson-details';
import useGetVrLessonById, { useGetVrLessonPresetFile } from '@/common/hooks/useGetVrLessonById';
import Loading from '@/common/components/loading';
import { mockPreset } from '../services/lesson-mock-data';
import { ChevronLeft } from 'lucide-react';

export default function VrLessonDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: lesson, isLoading: isLessonLoading } = useGetVrLessonById(id || '');
  const { data, isLoading: isTasksLoading } = useGetVrLessonPresetFile(lesson?.presetJsonRelativeFilePath || '');

  const tasks = data || mockPreset;

  const isLoading = isLessonLoading || isTasksLoading;

  if (isLoading) return <Loading isLoading={isLoading} />;
  if (!lesson || !tasks) {
    return (
      <div className='flex-1 flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-neutral-900 mb-2'>VR Lesson not found</h2>
          <p className='text-neutral-600 mb-4'>The VR lesson you're looking for doesn't exist.</p>
          <Link to='/lessons/list'>
            <Button className='bg-primary text-white hover:bg-primary/90'>Back to Lessons</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='flex-1 overflow-y-auto h-full'>
      <div className='max-w-4xl mx-auto px-8 py-8 overflow-y-auto'>
        {/* Back Button */}
        <Link
          to='/lessons/list'
          className='inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-6 transition-colors'
        >
          <ChevronLeft size={16} />
          <span>Quay lại danh sách bài học</span>
        </Link>

        {/* VR Lesson Details */}
        <VrLessonDetails lesson={lesson} tasks={tasks} />
      </div>
    </div>
  );
}
