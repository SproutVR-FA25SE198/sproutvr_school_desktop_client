import { useLocation } from 'react-router-dom';
import { SessionForm } from '../components/session-form';
import type { VrLessonRetrieve } from '@/common/types/vr-lesson.type';
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
          <div
            onClick={handleBack}
            className='inline-flex items-center gap-2 text-neutral-600 hover:cursor-pointer hover:text-neutral-900 transition-colors'
          >
            <ChevronLeft size={40} />
            <h1 className='text-3xl self-center font-bold text-neutral-900'>Mở phiên học VR</h1>
          </div>
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
