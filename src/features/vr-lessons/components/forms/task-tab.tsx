'use client';

import { useEffect } from 'react';
import { activityInputMap } from '../activity-input';
import { useFormContext } from '@/common/contexts/form-context';
import type { VrLessonRetrieve } from '@/common/types/vr-lesson.type';

interface TaskTabProps {
  taskNumber: number;
  vrLessonData: VrLessonRetrieve;
  valid?: boolean;
  setIsValid?: (isValid: boolean) => void;
}

export function TaskTab({ taskNumber, setIsValid }: TaskTabProps) {
  const { vrLessonData, updateTaskDetails } = useFormContext();

  useEffect(() => {
    // Initialize task details if not present
    updateTaskDetails(taskNumber, {
      vrTaskId: vrLessonData?.tasks[taskNumber - 1].id,
      activityType: vrLessonData?.tasks[taskNumber - 1].activityType.activityCode,
    });
  }, []);
  const taskInOrder = vrLessonData?.tasks.sort((a, b) => a.taskNumber - b.taskNumber);
  const taskSetup = taskInOrder?.[taskNumber - 1];
  const activityType = taskSetup?.activityType?.activityCode.toLowerCase();
  const ActivityComponent = activityInputMap[activityType as keyof typeof activityInputMap];
  if (!ActivityComponent) setIsValid?.(true);

  return (
    <div className='space-y-6'>
      {/* Task Info */}
      <div className='flex gap-2 items-center'>
        <p className='text-sm font-medium'>Mô tả:</p>
        <p className='text-sm text-muted-foreground'>{taskSetup?.description}</p>
      </div>
      <div className='grid grid-cols-2 gap-6'>
        <div className='space-y-4'>
          <div className='flex gap-2 items-center'>
            <p className='text-sm font-medium'>Vị trí nhiệm vụ:</p>
            <p className='text-sm text-muted-foreground'>{taskSetup?.taskLocation?.name}</p>
          </div>
          <div className='max-w-[300px]'>
            <img
              src={taskSetup?.taskLocation?.imageUrl || '/placeholder.svg'}
              alt={taskSetup?.taskLocation?.name}
              className='rounded-xl object-cover'
            />
          </div>
        </div>

        <div className='space-y-4'>
          <div className='flex gap-2 items-center'>
            <p className='text-sm font-medium'>Đồ vật:</p>
            <p className='text-sm text-muted-foreground'>{taskSetup?.mapObject?.name}</p>
          </div>
          <div className='max-h-[400px]'>
            <img
              src={taskSetup?.mapObject?.imageUrl || '/placeholder.svg'}
              alt={taskSetup?.mapObject?.name}
              className='h-full rounded-xl'
            />
          </div>
        </div>
      </div>

      {/* Activity Type */}
      <div className='flex gap-2 mt-12 mb-5 items-center justify-center'>
        <hr className='bg-primary w-50' />
        <h4 className='text-lg font-bold'>HOẠT ĐỘNG: {taskSetup?.activityType?.name?.toUpperCase()}</h4>
        <hr className='bg-primary w-50' />
      </div>

      {ActivityComponent ? (
        <ActivityComponent taskNumber={taskNumber} onValidChange={setIsValid} />
      ) : (
        <p className='text-sm text-muted-foreground text-center mb-5'>{`Học sinh sẽ ${activityType === 'grab' ? 'cầm nắm' : 'tương tác với'} đồ vật`}</p>
      )}
    </div>
  );
}
