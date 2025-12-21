'use client';

import { useFormContext } from '@/common/contexts/form-context';
import { VrTaskForm } from '../components/forms/vr-task-form';
import { OverviewTab } from '../components/forms/overview-tab';
import { TaskTab } from '../components/forms/task-tab';
import { Button } from '@/common/components/ui/button';
import useGetVrLessonById from '@/common/hooks/useGetVrLessonById';
import { useEffect, useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
import Loading from '@/common/components/loading';
import type { VrLessonRetrieve } from '@/common/types/vr-lesson.type';
import {
  AlertDialog,
  // AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/common/components/ui/alert-dialog';

export function PhaseTwo() {
  const { currentTab, submitForm, lessonData, setVrLessonData } = useFormContext();
  const [taskValidity, setTaskValidity] = useState<Record<number, boolean>>({});
  const [showWarning, setShowWarning] = useState(false);
  const pendingNavigation = useRef<string | null>(null);
  // const navigate = useNavigate();
  const { data: vrLesson, isLoading } = useGetVrLessonById(lessonData.id);

  // Handle browser/tab close and back button
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    // Intercept link clicks to show warning
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.href) {
        const url = new URL(anchor.href);
        const currentPath = window.location.hash.slice(1) || '/';
        const targetPath = url.hash.slice(1) || url.pathname;

        if (targetPath !== currentPath) {
          e.preventDefault();
          pendingNavigation.current = targetPath;
          setShowWarning(true);
        }
      }
    };

    // Handle browser back/forward buttons
    const handlePopState = () => {
      // Push the current state back to prevent navigation
      window.history.pushState(null, '', window.location.href);
      setShowWarning(true);
      pendingNavigation.current = 'back';
    };

    // Push initial state to handle back button
    window.history.pushState(null, '', window.location.href);

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('click', handleClick, true);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('click', handleClick, true);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // const handleConfirmLeave = () => {
  //   setShowWarning(false);
  //   if (pendingNavigation.current === 'back') {
  //     window.history.go(-2);
  //   } else if (pendingNavigation.current) {
  //     navigate(pendingNavigation.current);
  //   }
  //   pendingNavigation.current = null;
  // };

  const handleCancelLeave = () => {
    setShowWarning(false);
    pendingNavigation.current = null;
  };

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
          } else if (newValidity[task.taskNumber] === undefined) {
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
    <>
      {/* Navigation Warning Dialog */}
      <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xin hãy hoàn thành bài học VR</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn cần phải hoàn thành bài học VR trước khi rời khỏi trang này. Vui lòng hoàn tất các nhiệm vụ còn lại.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelLeave}>Thoát</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className='h-[calc(100vh-97px)] bg-background p-8'>
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
    </>
  );
}
