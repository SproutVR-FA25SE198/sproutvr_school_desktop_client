'use client';

import { LessonsGrid } from '../components/lesson-grid';

export default function LessonsPage() {
  return (
    <div className='overflow-y-auto border-r border-neutral-200 p-8'>
      <div className=''>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h2 className='text-2xl font-bold text-neutral-900 mb-1'>Lesson list</h2>
          </div>
        </div>

        <LessonsGrid />
      </div>
    </div>
  );
}
