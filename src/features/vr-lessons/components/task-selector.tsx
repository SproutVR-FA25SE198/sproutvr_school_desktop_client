'use client';

interface TaskSelectorProps {
  selectedTask: number;
  totalTasks: number;
  onTaskSelect: (taskNumber: number) => void;
  onAddTask: () => void;
}

export function TaskSelector({ selectedTask, totalTasks, onTaskSelect, onAddTask }: TaskSelectorProps) {
  return (
    <div className='flex items-center gap-2'>
      <span className='text-sm font-medium text-neutral-700'>Task:</span>
      <div className='flex gap-2'>
        {Array.from({ length: totalTasks }).map((_, index) => (
          <button
            key={index + 1}
            onClick={() => onTaskSelect(index + 1)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              selectedTask === index + 1
                ? 'bg-primary text-white'
                : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={onAddTask}
          className='w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-neutral-200 text-neutral-700 hover:bg-neutral-300 transition-colors'
        >
          +
        </button>
      </div>
    </div>
  );
}
