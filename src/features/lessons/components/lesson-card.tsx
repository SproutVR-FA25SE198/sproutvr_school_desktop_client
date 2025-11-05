'use client';

import type { Lesson } from '@/common/types/lesson.type';

interface LessonCardProps {
  lesson: Lesson;
  onSelect: (lessonId: string) => void;
}

export function LessonCard({ lesson, onSelect }: LessonCardProps) {
  return (
    <button
      onClick={() => onSelect(lesson.id)}
      className={`text-left  grid grid-cols-2 gap-3 p-3 rounded-lg overflow-hidden transition-all hover:ring-2 hover:ring-secondary/50`}
    >
      <div className='bg-neutral-200 h-32 rounded-lg overflow-hidden'>
        <img
          src={lesson.subjectImage || '/placeholder.svg'}
          alt={lesson.subjectName}
          className='w-full h-full object-cover'
        />
      </div>
      <div className='space-y-1'>
        <p className='text-sm font-medium text-neutral-700'>{lesson.subjectName}</p>
        <h3 className='font-semibold text-neutral-900 line-clamp-2'>{lesson.name}</h3>
        <p className='text-sm text-neutral-600'>VR Lessons: {lesson.vrLessonCount}</p>
        <p className='text-xs text-neutral-500'>{new Date(lesson.updatedAt).toLocaleDateString()}</p>
      </div>
    </button>
  );
}
