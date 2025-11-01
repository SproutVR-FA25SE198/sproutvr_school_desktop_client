'use client';

import { Input } from '@/common/components/ui/input';

interface LessonNameInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function VrLessonNameInput({ value, onChange, error }: LessonNameInputProps) {
  return (
    <div className='space-y-2'>
      <label className='text-sm font-medium text-foreground'>Name:</label>
      <Input
        type='text'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder='Enter lesson name'
        className={error ? 'border-red-500' : ''}
      />
      {error && <p className='text-xs text-red-500'>{error}</p>}
    </div>
  );
}
