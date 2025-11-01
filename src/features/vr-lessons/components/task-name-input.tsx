'use client';

import { Input } from '@/common/components/ui/input';

interface TaskNameInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function TaskNameInput({ value, onChange, error }: TaskNameInputProps) {
  return (
    <div className='space-y-2'>
      <label className='text-sm font-medium text-neutral-700'>Task name:</label>
      <Input
        type='text'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder='Enter task name'
        className={`${error ? 'border-red-500' : ''}`}
      />
      {error && <p className='text-xs text-red-500'>{error}</p>}
    </div>
  );
}
