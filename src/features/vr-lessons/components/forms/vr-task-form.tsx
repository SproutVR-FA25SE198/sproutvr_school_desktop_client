'use client';

import { useFormContext } from '@/common/contexts/form-context';
import { cn } from '@/common/utils';

export function VrTaskForm() {
  const { currentTab, setCurrentTab, tasks } = useFormContext();

  const taskNumbers = Object.keys(tasks)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className='flex flex-col gap-2 border-r border-border pr-4 min-w-[140px]'>
      <button
        onClick={() => setCurrentTab('overview')}
        className={cn(
          'px-4 py-2 text-left text-sm font-medium rounded-md transition-colors',
          currentTab === 'overview' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground',
        )}
      >
        Tổng quan
      </button>
      {taskNumbers.map((taskNum) => (
        <button
          key={taskNum}
          onClick={() => setCurrentTab(`task-${taskNum}`)}
          className={cn(
            'px-4 py-2 text-left text-sm font-medium rounded-md transition-colors',
            currentTab === `task-${taskNum}`
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-muted text-muted-foreground',
          )}
        >
          Nhiệm vụ {taskNum}
        </button>
      ))}
    </div>
  );
}
