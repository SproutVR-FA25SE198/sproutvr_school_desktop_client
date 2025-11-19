'use client';
import { MOCK_VR_LEARNING_SESSION } from '../services/mock-data';
import type { VRTask } from '../services/session.type';

export function TaskMenu({ tasks }: { tasks: VRTask[] }) {
  return (
    <div className='flex-1 overflow-y-auto'>
      <div className='space-y-2 p-4'>
        {tasks.map((task) => (
          <div
            key={task.vr_task_id}
            className='rounded-lg border border-neutral-200 p-3 hover:border-[#0f2c5b] hover:bg-blue-50 transition-colors'
          >
            <div className='flex justify-between items-start'>
              <div>
                <p className='text-xs font-bold text-[#0f2c5b] uppercase'>{task.vr_task_id.slice(0, 8)}</p>
                <p className='text-xs text-neutral-600 mt-1'>{task.question_name || 'No question available'}</p>
              </div>
              <span
                className={`rounded px-2 py-1 text-xs font-medium ${
                  task.is_completed
                    ? task.is_correct
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                    : 'bg-neutral-100 text-neutral-700'
                }`}
              >
                {task.is_completed ? (task.is_correct ? 'Correct' : 'Incorrect') : 'Pending'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
