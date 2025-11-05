'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select';
import { lessons } from '../services/mock-data';

interface LessonSelectProps {
  subject: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function LessonSelect({ subject, value, onChange, error }: LessonSelectProps) {
  const availableLessons = subject ? lessons : [];

  return (
    <div className='space-y-2'>
      <label className='text-sm font-medium text-neutral-700'>Lesson</label>
      <Select value={value} onValueChange={onChange} disabled={!subject}>
        <SelectTrigger className={error ? 'border-red-500' : ''}>
          <SelectValue placeholder='Select a lesson' />
        </SelectTrigger>
        <SelectContent>
          {availableLessons.map((lesson) => (
            <SelectItem key={lesson.id} value={lesson.id}>
              {lesson.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className='text-xs text-red-500'>{error}</p>}
    </div>
  );
}
