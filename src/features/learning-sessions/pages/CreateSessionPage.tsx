import { useLocation } from 'react-router-dom';
import { SessionForm } from '../components/session-form';
import type { VrLessonRetrieve } from '@/common/types/vr-lesson.type';
import { Button } from '@/common/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function CreateSessionPage() {
  const location = useLocation();
  const state = location.state as {
    vrLesson?: VrLessonRetrieve;
    lessonId?: string;
    classroomNumber?: string;
    classroomLetter?: string;
  };
  const vrLesson = state?.vrLesson;
  const lessonId = state?.lessonId;
  const classroomNumber = state?.classroomNumber;
  const classroomLetter = state?.classroomLetter;

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className='flex-1 overflow-auto p-8'>
      <div className='max-w-6xl mx-auto'>
        <div className='flex items-center gap-4 mb-8'>
          <Button
            variant='ghost'
            size='icon'
            onClick={handleBack}
            className='rounded-full border border-primary/40 bg-white shadow-sm'
          >
            <ChevronLeft className='size-5' />
          </Button>
          <h1 className='text-3xl self-center font-bold text-neutral-900'>Mở phiên học VR</h1>
        </div>
        <SessionForm
          vrLesson={vrLesson}
          lessonId={lessonId}
          classroomNumber={classroomNumber}
          classroomLetter={classroomLetter}
        />
      </div>
    </div>
  );
}
