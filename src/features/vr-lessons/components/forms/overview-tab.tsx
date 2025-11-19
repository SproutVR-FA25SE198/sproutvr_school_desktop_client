'use client';

import { Button } from '@/common/components/ui/button';
import { Label } from '@/common/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/common/components/ui/radio-group';
import { useFormContext } from '@/common/contexts/form-context';
import type { VrLessonRetrieve } from '@/common/types/vr-lesson.type';

export function OverviewTab({ vrLessonData }: { vrLessonData: VrLessonRetrieve }) {
  const { tasks, tasksType, setTasksType, setCurrentTab } = useFormContext();

  const taskNumbers = Object.keys(tasks)
    .map(Number)
    .sort((a, b) => a - b);

  const handleFinishSetup = () => {
    if (taskNumbers.length > 0) {
      setCurrentTab(`task-${taskNumbers[0]}`);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold'>{vrLessonData?.name || '[VRLesson name]'}</h1>
          {/* <div className='flex gap-2'>
            <Button variant='ghost' size='sm'>
              Edit
            </Button>
            <Button variant='ghost' size='sm' className='text-destructive'>
              Remove
            </Button>
          </div> */}
        </div>
        <p className='text-sm text-muted-foreground'>{vrLessonData?.lesson?.name}</p>
        <p className='text-sm text-foreground leading-relaxed'>{vrLessonData?.description}</p>
      </div>

      {/* Finish Setup Button */}
      <Button onClick={handleFinishSetup} variant='outline' className='w-full bg-transparent'>
        Hoàn tất thiết lập nhiệm vụ bài học
      </Button>

      {/* Overview Details */}
      <div className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <div className='mb-4 flex gap-2 items-center'>
              <p className='text-sm font-medium'>Tổng thời lượng:</p>
              <p className='text-sm '>{vrLessonData?.maxDuration}</p>
            </div>
            <div className='mb-4 flex gap-2 items-center'>
              <p className='text-sm font-medium'>Bản đồ:</p>
              <p className='text-sm '>{vrLessonData?.map?.name}</p>
            </div>
            {/* Task Previews */}
            <div className='max-w-[300px]'>
              <img src={vrLessonData?.map?.imageUrl} alt='Map Thumbnail' className='w-full h-auto rounded-md mb-2' />
            </div>
          </div>
          <div>
            <div className='space-y-2 rounded-lg border border-secondary p-4 pt-2 flex gap-4'>
              <Label className='text-sm font-medium'>Loại nhiệm vụ:</Label>
              <RadioGroup value={tasksType} onValueChange={(value) => setTasksType(value as 'ordered' | 'unordered')}>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='unordered' id='unordered' />
                  <Label htmlFor='unordered' className='font-normal cursor-pointer'>
                    Không theo thứ tự
                  </Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='ordered' id='ordered' />
                  <Label htmlFor='ordered' className='font-normal cursor-pointer'>
                    Theo thứ tự
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
