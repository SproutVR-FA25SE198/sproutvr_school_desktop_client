'use client';
import { useStepOneForm } from '../../hooks/use-step-one-form';
import { useFormContext } from '@/common/contexts/form-context';
import { SubjectSelect } from '../subject-select';
import { LessonSelect } from '../lesson-select';
import { DurationInput } from '../duration-input';
// import { InstructionsTextarea } from './instructions-textarea';
import { MapSelect } from '../map-select';
import { MapPreview } from '../map-preview';
import { Button } from '@/common/components/ui/button';
import { DurationToHHMMSS, HHMMSSToDuration } from '@/common/utils/duration-converter';
import type { LessonRetrieve } from '@/common/types/lesson.type';
import { useEffect } from 'react';
import type { MapRetrieveResponse } from '@/common/types/map.type';
import { ChevronLeft } from 'lucide-react';

export function PhaseOneStepOne({ lesson, maps }: { lesson?: LessonRetrieve; maps: MapRetrieveResponse }) {
  const { lessonData, updateLessonData, goToStep } = useFormContext();
  const { formData, errors, updateField, isValid } = useStepOneForm(lessonData, updateLessonData);

  useEffect(() => {
    if (lesson) {
      updateField('lesson', lesson.id);
      updateField('subject', lesson.subject.id);
    }
  }, []);

  const handleNext = () => {
    if (isValid) {
      updateLessonData(formData);
      goToStep(2);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className='min-h-screen bg-neutral-50 p-6'>
      <div className='max-w-7xl m-auto'>
        <div className='flex items-center gap-4 mb-8'>
          <Button variant='ghost' size='icon' onClick={handleBack} className='rounded-full bg-white shadow-sm'>
            <ChevronLeft className='size-5' />
          </Button>
          <h1 className='text-3xl self-center font-bold text-neutral-900'>Tạo bài học VR mới</h1>
        </div>
        {/* Main Content - 2 Column Layout */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Left Column - Form */}
          <div className='space-y-6'>
            <div className='bg-white rounded-lg border border-neutral-200 p-6 space-y-6'>
              <SubjectSelect
                value={formData.subject}
                onChange={(value) => updateField('subject', value)}
                subjectName={lesson?.subject.name}
                error={errors.subject}
              />

              <LessonSelect
                value={formData.lesson}
                lesson={lesson}
                onChange={(value) => updateField('lesson', value)}
                error={errors.lesson}
              />

              <hr className='mt-8' />
              <div className='text-center py-0 mb-4 pt-0 text-sm text-gray-700 italic'>
                Thiết lập thời lượng bài học. Các nhiệm vụ sẽ được phân bổ trong khoảng thời gian này.
                <br />
                Thời lượng tối đa: 60 phút.
              </div>
              <DurationInput
                value={HHMMSSToDuration(formData.duration) || { minutes: 0, seconds: 0 }}
                onChange={(value) =>
                  updateField('duration', DurationToHHMMSS({ minutes: value.minutes, seconds: value.seconds }))
                }
                error={errors.duration}
              />
            </div>
          </div>

          {/* Right Column - Map Preview */}
          <div className='space-y-6'>
            <div className='bg-white rounded-lg border border-neutral-200 p-6 space-y-4'>
              <MapSelect
                maps={maps?.items.filter(m => m.status.key === 1) || []}
                value={formData.map}
                onChange={(value) => updateField('map', value)}
                error={errors.map}
              />

              <MapPreview selectedMapId={formData.map} maps={maps?.items.filter(m => m.status.key === 1) || []} />
            </div>
          </div>
        </div>

        {/* Bottom Action - Next Button */}
        <div className='mt-8 flex justify-end'>
          <Button
            onClick={handleNext}
            disabled={!isValid}
            className='px-8 py-2 bg-primary hover:bg-primary-light text-white rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Tiếp theo
          </Button>
        </div>
      </div>
    </div>
  );
}
