'use client';
import type { VrTaskRetrieve } from '@/common/types/vr-lesson.type';

export function TaskMenu({ taskArr }: { taskArr: VrTaskRetrieve[] }) {
  const tasks = taskArr.sort((a, b) => a.taskNumber - b.taskNumber);
  return (
    <div className='flex-1 overflow-y-auto'>
      <div className='space-y-2 p-4'>
        {tasks.map((task) => (
          <div
            key={task.id}
            className='rounded-lg border border-neutral-200 p-3 hover:border-[#0f2c5b] hover:bg-blue-50 transition-colors'
          >
            <div className='flex flex-col justify-between'>
              <div className='flex items-center justify-between'>
                <p className='text-xs font-bold text-[#0f2c5b] uppercase'>Nhiệm vụ {task.taskNumber}</p>
                <p className={`rounded px-2 py-1 text-xs font-medium `}>{task.activityType.name}</p>
              </div>
              <p className='text-xs text-neutral-600 mt-1'>{task.question || task.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
