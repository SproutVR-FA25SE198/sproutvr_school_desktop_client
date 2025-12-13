'use client';
import type { LessonRetrieve } from '../services/lesson.service';

interface LessonCardProps {
  lesson: LessonRetrieve;
  onSelect: (lessonId: string) => void;
}

export function LessonCard({ lesson, onSelect }: LessonCardProps) {
  return (
    <button
      onClick={() => onSelect(lesson.id)}
      className={`text-left  grid grid-cols-2 gap-3 p-3 rounded-lg overflow-hidden transition-all hover:ring-1 hover:ring-secondary/50`}
    >
      <div className='bg-neutral-200 h-60 rounded-lg overflow-hidden'>
        <img
          src={lesson.subject.imageUrl || '/placeholder.svg'}
          alt={lesson.subject.name}
          className='w-full h-full object-cover'
        />
      </div>
      <div className='space-y-1'>
        <p className='text-sm font-medium text-neutral-700'>{lesson.subject.name}</p>
        <h3 className='font-semibold text-neutral-900 line-clamp-2'>{lesson.name}</h3>
        <p className='text-xs text-neutral-500'>{new Date(lesson.createdAtUtc).toLocaleDateString()}</p>
      </div>
    </button>
  );
}
