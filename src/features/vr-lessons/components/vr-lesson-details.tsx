'use client';
import { CreateLearningSessionDialog } from '@/common/components/create-learning-session-dialog';
import { Badge } from '@/common/components/ui/badge';
import { Button } from '@/common/components/ui/button';
import { Card } from '@/common/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/common/components/ui/collapsible';
import type { VrLessonPresetExtended, VrLessonRetrieve } from '@/common/types/vr-lesson.type';
import routes from '@/core/configs/routes';
import { BookOpen, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface VrLessonDetailsProps {
  lesson: VrLessonRetrieve;
  tasks: VrLessonPresetExtended;
}

export function VrLessonDetails({ lesson, tasks }: VrLessonDetailsProps) {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const navigate = useNavigate();

  const handleOpenVrClassroom = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmCreate = (
    vrLessonId: string,
    vrLesson: VrLessonRetrieve,
    classroomNumber: string,
    classroomLetter: string,
  ) => {
    navigate(routes.vrSessionCreate, {
      state: { lessonId: vrLessonId, vrLesson, classroomNumber, classroomLetter },
    });
  };

  const tasksInOrder = tasks.vrTasks.slice().sort((a, b) => a.taskNumber - b.taskNumber);

  const getActionLabel = (activityCode: string) => {
    switch (activityCode) {
      case 'grab':
        return 'cầm nắm đối tượng';
      case 'interact':
        return 'tương tác với đối tượng';
      default:
        return 'thực hiện hành động';
    }
  };

  return (
    <div className='space-y-6'>
      <CreateLearningSessionDialog
        open={showConfirmDialog}
        initialVrLesson={lesson}
        onOpenChange={setShowConfirmDialog}
        onConfirm={handleConfirmCreate}
        confirmText='Tiếp tục'
        cancelText='Hủy'
      />
      {/* Header */}
      <div className='bg-white rounded-lg p-6 border border-neutral-200'>
        <div className='flex items-start justify-between items-center mb-0'>
          <div className='flex-1'>
            <h1 className='text-3xl font-bold text-neutral-900 mb-2'>{lesson.name}</h1>
            <p className='text-sm text-neutral-600 mb-4'>
              {lesson.lesson.name} • {lesson.map.name}
            </p>
          </div>
          <Button variant='secondary' size='sm' onClick={handleOpenVrClassroom}>
            <BookOpen /> Mở phiên học VR
          </Button>
        </div>

        <p className='text-neutral-700 text-sm leading-relaxed mb-6'>{lesson.description}</p>
        <img
          src={lesson.map.imageUrl}
          alt={lesson.map.name}
          className='w-full h-[300px] object-cover rounded-lg mb-6'
        />

        {/* Metadata Grid */}
        <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
          <div className='bg-neutral-50 rounded p-4'>
            <p className='text-md font-medium text-neutral-600 mb-1'>Thời lượng</p>
            <p className='text-sm font-semibold text-neutral-900'>{lesson.duration || lesson.maxDuration}</p>
          </div>
          <div className='bg-neutral-50 rounded p-4'>
            <p className='text-md font-medium text-neutral-600 mb-1'>Tổng số nhiệm vụ</p>
            <p className='text-sm font-semibold text-neutral-900'>{lesson.tasks.length}</p>
          </div>
          <div className='bg-neutral-50 rounded p-4'>
            <p className='text-md font-medium text-neutral-600 mb-1'>Ngày tạo</p>
            <p className='text-sm font-semibold text-neutral-900'>
              {new Date(lesson.createdAtUtc).toLocaleDateString('vi-VN')}
            </p>
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div className='bg-white rounded-lg p-6 border border-neutral-200'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-2xl font-bold text-neutral-900'>Nhiệm vụ ({lesson.tasks.length})</h2>
          <span className='italic my-auto'>{tasks.isSequential ? 'Nhiệm vụ tuần tự' : 'Nhiệm vụ tự do'}</span>
        </div>
        <div className='space-y-3'>
          {tasksInOrder.map((task, index) => {
            const activity = task.mapObject.activityType;
            const isAction = activity.activityCode === 'grab' || activity.activityCode === 'interact';
            const isQuiz = activity.activityCode === 'quiz';
            const displayInfo = isAction
              ? 'Học sinh sẽ ' + getActionLabel(activity.activityCode)
              : activity.config?.question || activity.config?.information;
            return (
              <Collapsible
                key={task.vrTaskId}
                open={expandedTask === task.vrTaskId}
                onOpenChange={(open) => setExpandedTask(open ? task.vrTaskId : null)}
              >
                <CollapsibleTrigger asChild>
                  <button className='w-full flex items-center gap-3 justify-between p-4 bg-neutral-50 hover:bg-neutral-100 rounded-lg border border-neutral-200 transition-colors text-left'>
                    <div className='flex-1'>
                      <div className='flex items-center gap-3'>
                        <span className='inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-semibold'>
                          {index + 1}
                        </span>
                        <p className='text-sm font-medium text-neutral-900'>{task.taskDescription}</p>
                      </div>
                    </div>
                    <Badge variant={'secondary'}>{activity.name}</Badge>
                    <ChevronDown className='w-5 h-5 text-neutral-500 flex-shrink-0 transition-transform duration-200' />
                  </button>
                </CollapsibleTrigger>

                <CollapsibleContent className='pt-2'>
                  <Card className='p-4 bg-neutral-50 border border-neutral-200'>
                    <div className={`mb-4 pb-4 border-b flex flex-row justify-start gap-20 border-neutral-200`}>
                      <div className='text-sm text-neutral-700'>
                        <p className='font-medium'>Vị trí:</p> {task.locationName}
                        <img
                          src={task.locationImageUrl}
                          alt={task.locationName}
                          className='mt-2 h-32 object-cover rounded'
                        />
                      </div>
                      <div className='text-sm text-neutral-700'>
                        <p className='font-medium'>Đối tượng:</p> {task.mapObject.name}
                        <img
                          src={task.mapObject.imageUrl}
                          alt={task.mapObject.name}
                          className='mt-2 h-32 object-cover rounded'
                        />
                      </div>
                    </div>

                    {/* Information */}

                    <div className={isQuiz ? `mb-4 pb-4 border-b border-neutral-200` : ''}>
                      <p className='text-sm text-neutral-700'>
                        {isQuiz ? (
                          <span className='font-medium'>Câu hỏi: </span>
                        ) : (
                          <span className='font-medium'>Thông tin nhiệm vụ: </span>
                        )}
                        {activity.config?.information || activity.config?.question || displayInfo}
                      </p>
                    </div>

                    {/* Answers */}
                    {isQuiz && (
                      <div>
                        <p className='text-xs font-medium text-neutral-600 mb-3'>Câu trả lời</p>
                        <div className='space-y-2'>
                          {activity.config?.answers?.map((answer, index) => (
                            <div
                              key={`${task.vrTaskId}-answer-${index}`}
                              className={`p-3 rounded border-2 transition-colors ${
                                answer.isCorrect ? 'border-green-500 bg-green-50' : 'border-neutral-200 bg-white'
                              }`}
                            >
                              <div className='flex items-start gap-2'>
                                <div
                                  className={`w-4 h-4 rounded-full flex-shrink-0 mt-1 ${
                                    answer.isCorrect ? 'bg-green-500' : 'bg-neutral-300'
                                  }`}
                                />
                                <div className='flex-1'>
                                  <p className='text-sm text-neutral-900'>{answer.text}</p>
                                  {answer.isCorrect && (
                                    <Badge className='mt-2 bg-green-600 text-white text-xs'>Đáp án đúng</Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </div>
    </div>
  );
}
