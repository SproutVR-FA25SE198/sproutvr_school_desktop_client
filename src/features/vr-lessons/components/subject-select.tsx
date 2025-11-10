'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select';

interface SubjectSelectProps {
  value: string;
  subjectName?: string;
  onChange: (value: string) => void;
  error?: string;
}

export function SubjectSelect({ value, onChange, error, subjectName }: SubjectSelectProps) {
  console.log('current subject:', value, subjectName);
  return (
    <div className='space-y-2'>
      <label className='text-sm font-medium text-neutral-700'>Môn học</label>
      <Select value={value} onValueChange={onChange} disabled={true}>
        <SelectTrigger className={error ? 'border-red-500' : ''}>
          <SelectValue placeholder='Chọn môn học' />
        </SelectTrigger>
        <SelectContent>
          {/* {subjects.map((subject) => ( */}
          <SelectItem key={value} value={value}>
            {subjectName}
          </SelectItem>
          {/* ))} */}
        </SelectContent>
      </Select>
      {error && <p className='text-xs text-red-500'>{error}</p>}
    </div>
  );
}
