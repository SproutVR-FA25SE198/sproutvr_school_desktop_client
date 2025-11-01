'use client';

import { Button } from '@/common/components/ui/button';
import { Label } from '@/common/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/common/components/ui/radio-group';
import { useFormContext } from '@/common/contexts/form-context';
import { lessons, maps, subjects } from '../../services/mock-data';

export function OverviewTab() {
  const { lessonData, tasks, tasksType, setTasksType, setCurrentTab } = useFormContext();

  const subjectLabel = subjects.find((s) => s.id === lessonData.subject)?.name || '';
  const lessonLabel = lessons.find((l) => l.id === lessonData.lesson)?.name || '';
  const mapLabel = maps.find((m) => m.id === lessonData.map)?.name || '';

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
          <h1 className='text-3xl font-bold'>{lessonData.name || '[VRLesson name]'}</h1>
          {/* <div className='flex gap-2'>
            <Button variant='ghost' size='sm'>
              Edit
            </Button>
            <Button variant='ghost' size='sm' className='text-destructive'>
              Remove
            </Button>
          </div> */}
        </div>
        <p className='text-sm text-muted-foreground'>
          {subjectLabel} • {lessonLabel}
        </p>
        <p className='text-sm text-foreground leading-relaxed'>{lessonData.description}</p>
      </div>

      {/* Finish Setup Button */}
      <Button onClick={handleFinishSetup} variant='outline' className='w-full bg-transparent'>
        Finish setting up your vr lesson
      </Button>

      {/* Overview Details */}
      <div className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <div className='mb-4 flex gap-2 items-center'>
              <p className='text-sm font-medium'>Total duration:</p>
              <p className='text-sm '>{lessonData.duration}</p>
            </div>
            <div className='mb-4 flex gap-2 items-center'>
              <p className='text-sm font-medium'>Map:</p>
              <p className='text-sm '>{mapLabel}</p>
            </div>
            {/* Task Previews */}
            <div className='grid grid-cols-3 gap-4'>
              {taskNumbers.map((taskNum) => (
                <div
                  key={taskNum}
                  className='aspect-video bg-muted rounded-lg flex items-center justify-center text-sm text-muted-foreground'
                >
                  Task {taskNum}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className='space-y-2 rounded-lg border border-secondary p-4 pt-2 flex gap-4'>
              <Label className='text-sm font-medium'>Tasks Type:</Label>
              <RadioGroup value={tasksType} onValueChange={(value) => setTasksType(value as 'ordered' | 'unordered')}>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='unordered' id='unordered' />
                  <Label htmlFor='unordered' className='font-normal cursor-pointer'>
                    Unordered
                  </Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='ordered' id='ordered' />
                  <Label htmlFor='ordered' className='font-normal cursor-pointer'>
                    Ordered
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
