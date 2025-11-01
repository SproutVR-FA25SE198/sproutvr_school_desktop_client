'use client';

import { useState } from 'react';
import { activityInputMap } from '../activity-input';
import { useFormContext } from '@/common/contexts/form-context';
import { Button } from '@/common/components/ui/button';

interface TaskTabProps {
  taskNumber: number;
}

export function TaskTab({ taskNumber }: TaskTabProps) {
  const { taskSetups } = useFormContext();
  const [isValid, setIsValid] = useState(false);

  const taskSetup = taskSetups[taskNumber];
  const activityType = taskSetup?.activityType?.toLowerCase();
  const ActivityComponent = activityInputMap[activityType as keyof typeof activityInputMap];

  return (
    <div className='space-y-6'>
      {/* Task Info */}
      <div>
        <p className='text-sm font-medium'>Description:</p>
        <p className='text-sm text-muted-foreground'>{taskSetup.description}</p>
      </div>
      <div className='grid grid-cols-2 gap-6'>
        <div className='space-y-4'>
          <div className='flex gap-2 items-center'>
            <p className='text-sm font-medium'>Task location:</p>
            <p className='text-sm text-muted-foreground'>{taskSetup.taskLocation}</p>
          </div>
          <div className='aspect-video bg-muted rounded-lg' />
        </div>

        <div className='space-y-4'>
          <div className='flex gap-2 items-center'>
            <p className='text-sm font-medium'>Map object:</p>
            <p className='text-sm text-muted-foreground'>{taskSetup.mapObject}</p>
          </div>
          <div className='aspect-square bg-muted rounded-lg max-w-[200px]' />
        </div>
      </div>

      {/* Activity Type */}
      <div className='flex gap-2 mb-5 mt-7 items-center justify-center'>
        <hr className='bg-primary w-50' />
        <h4 className='text-lg font-bold'>{taskSetup.activityType.toUpperCase()}</h4>
        <hr className='bg-primary w-50' />
      </div>

      {ActivityComponent ? (
        <ActivityComponent taskNumber={taskNumber} onValidChange={setIsValid} />
      ) : (
        <p className='text-sm text-muted-foreground'>No activity type selected.</p>
      )}

      <div className='flex justify-end'>
        <Button disabled={!isValid}>Save Task</Button>
      </div>
    </div>
  );
}
