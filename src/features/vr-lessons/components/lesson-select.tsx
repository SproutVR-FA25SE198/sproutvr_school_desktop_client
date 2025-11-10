'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select';
import type { LessonRetrieve } from '@/common/types/lesson.type';

interface LessonSelectProps {
  lesson?: LessonRetrieve;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function LessonSelect({ value, onChange, error, lesson }: LessonSelectProps) {
  return (
    <div className='space-y-2'>
      <label className='text-sm font-medium text-neutral-700'>Bài học</label>
      <Select value={value} onValueChange={onChange} disabled={true}>
        <SelectTrigger className={error ? 'border-red-500' : ''}>
          <SelectValue placeholder='Chọn bài học' />
        </SelectTrigger>
        <SelectContent>
          {/* {availableLessons.map((lesson) => ( */}
          <SelectItem key={lesson?.id} value={value}>
            {lesson?.name}
          </SelectItem>
          {/* ))} */}
        </SelectContent>
      </Select>
      {error && <p className='text-xs text-red-500'>{error}</p>}
    </div>
  );
}
