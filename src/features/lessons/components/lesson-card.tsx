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
        <p className='text-md font-medium text-neutral-700'>{lesson.subject.name}</p>
        <h2 className='font-semibold text-2xl text-neutral-900 line-clamp-2'>{lesson.name}</h2>
        <p className='text-md text-neutral-700 mb-6'>{lesson.description}</p>

        <p className='text-md text-neutral-700'>Bài học VR: {lesson.vrLessonsCount}</p>
        <p className='text-md text-neutral-500'>
          Ngày tạo: {new Date(lesson.createdAtUtc).toLocaleDateString('vi-VN')}
        </p>
      </div>
    </button>
  );
}
