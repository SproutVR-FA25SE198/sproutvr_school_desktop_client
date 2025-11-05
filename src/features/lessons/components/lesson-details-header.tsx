'use client';

import { Button } from '@/common/components/ui/button';
import type { Lesson } from '@/common/types/lesson.type';

interface LessonDetailsHeaderProps {
  lesson: Lesson;
}

export function LessonDetailsHeader({ lesson }: LessonDetailsHeaderProps) {
  return (
    <div className='bg-white rounded-lg p-6 mb-4'>
      <div className='flex items-start justify-between mb-4'>
        <div className='flex-1'>
          <h1 className='text-3xl font-bold text-neutral-900 mb-2'>{lesson.name}</h1>
          <p className='text-sm text-neutral-600 mb-3'>
            {lesson.subjectName} • {lesson.name}
          </p>
          <p className='text-sm text-neutral-500'>Last update: {new Date(lesson.updatedAt).toLocaleDateString()}</p>
        </div>
        <div className='flex gap-2'>
          <Button variant='ghost' size='sm'>
            Edit
          </Button>
          <Button variant='ghost' size='sm'>
            Remove
          </Button>
        </div>
      </div>

      <p className='text-neutral-700 text-sm leading-relaxed mb-4'>{lesson.description}</p>

      <div className='flex gap-6 text-sm'>
        <div>
          <p className='text-neutral-600'>Total Learning Sessions</p>
          <p className='font-semibold text-neutral-900'>{lesson.vrLessonCount}</p>
        </div>
        <div>
          <p className='text-neutral-600'>Status</p>
          <p className='font-semibold text-neutral-900 capitalize'>{lesson.status}</p>
        </div>
      </div>

      <div className='mt-4 pt-4 border-t border-neutral-200'>
        <a href='#' className='text-primary font-medium hover:underline text-sm'>
          Lesson Material resources →
        </a>
      </div>
    </div>
  );
}
