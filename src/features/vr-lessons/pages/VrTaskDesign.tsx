'use client';

import { useFormContext } from '@/common/contexts/form-context';
import { VrTaskForm } from '../components/forms/vr-task-form';
import { OverviewTab } from '../components/forms/overview-tab';
import { TaskTab } from '../components/forms/task-tab';
import { Button } from '@/common/components/ui/button';
import useGetVrLessonById from '@/common/hooks/useGetVrLessonById';
import { useEffect, useState } from 'react';
import Loading from '@/common/components/loading';
import type { VrLessonRetrieve } from '@/common/types/vr-lesson.type';

export function PhaseTwo() {
  const { currentTab, submitForm, lessonData, setVrLessonData } = useFormContext();
  const [taskValidity, setTaskValidity] = useState<Record<number, boolean>>({});
  const { data: vrLesson, isLoading } = useGetVrLessonById(lessonData.id);

  const updateTaskValidity = (taskNumber: number, valid: boolean) => {
    setTaskValidity((prev) => ({
      ...prev,
      [taskNumber]: valid,
    }));
  };

  const allTasksValid =
    Object.keys(taskValidity).length === vrLesson?.tasks.length && Object.values(taskValidity).every(Boolean);

  const handleFinish = () => {
    if (Object.values(taskValidity).every(Boolean)) {
      submitForm();
    }
  };

  useEffect(() => {
    if (vrLesson) {
      setVrLessonData(vrLesson);

      setTaskValidity((prev) => {
        const newValidity = { ...prev };

        vrLesson.tasks.forEach((task) => {
          const type = task.activityType.activityCode.toLowerCase();

          if (type === 'grab' || type === 'interact') {
            newValidity[task.taskNumber] = true;
          } 
          else if (newValidity[task.taskNumber] === undefined) {
            newValidity[task.taskNumber] = false;
          }
        });

        return newValidity;
      });
    }
  }, [vrLesson, setVrLessonData]);

  if (isLoading) return <Loading isLoading />;

  const renderContent = () => {
    if (currentTab === 'overview') {
      return <OverviewTab vrLessonData={vrLesson || ({} as VrLessonRetrieve)} />;
    }

    const taskMatch = currentTab.match(/^task-(\d+)$/);
    if (taskMatch) {
      const taskNumber = Number.parseInt(taskMatch[1]);
      return (
        <TaskTab
          valid={taskValidity[taskNumber] ?? false}
          setIsValid={(valid) => updateTaskValidity(taskNumber, valid)}
          taskNumber={taskNumber}
          vrLessonData={vrLesson || ({} as VrLessonRetrieve)}
        />
      );
    }

    return null;
  };

  return (
    <div className='min-h-screen bg-background p-8'>
      <div className='max-w-7xl mx-auto space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div></div>
          <Button variant='secondary' onClick={handleFinish} disabled={!allTasksValid}>
            Hoàn tất bài học VR
          </Button>
        </div>

        {/* Main Content */}
        <div className='bg-card rounded-lg border border-border p-6'>
          <div className='flex gap-6'>
            <VrTaskForm />
            <div className='flex-1'>{renderContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}