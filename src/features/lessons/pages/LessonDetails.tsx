'use client';

import { Link, useParams } from 'react-router-dom';
import { LessonDetailsHeader } from '../components/lesson-details-header';
import { VRLessonsList } from '../components/vr-lessons-list';
import { Button } from '@/common/components/ui/button';
import { MOCK_LESSONS } from '../services/lessons-mock-data';

export default function LessonDetailsPage() {
  const params = useParams();
  console.log('Params:', params);
  const lessonId = params.id as string;
  const lesson = MOCK_LESSONS.find((l) => l.id === lessonId);

  if (!lesson) {
    return (
      <div className='flex-1 flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-neutral-900 mb-2'>Lesson not found</h2>
          <p className='text-neutral-600 mb-4'>The lesson you're looking for doesn't exist.</p>
          <Link to='/'>
            <Button className='bg-primary text-white hover:bg-primary/90'>Back to Lessons</Button>
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
          <span>‹</span>
          <span>Back to Lessons</span>
        </Link>

        {/* Lesson Details */}
        <LessonDetailsHeader lesson={lesson} />

        <VRLessonsList lesson={lesson} />

        {/* Open Folder Action */}
        <div className='mt-8 flex gap-3'>
          <Button variant='outline' className='border-neutral-300 bg-transparent'>
            Clear
          </Button>
          <Button className='bg-primary text-white hover:bg-primary/90'>Open this folder onClick</Button>
        </div>
      </div>
    </div>
  );
}
