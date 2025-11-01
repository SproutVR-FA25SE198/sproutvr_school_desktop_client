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

export function PhaseOneStepOne() {
  const { lessonData, updateLessonData, goToStep } = useFormContext();
  const { formData, errors, updateField, isValid } = useStepOneForm(lessonData, updateLessonData);

  const handleNext = () => {
    if (isValid) {
      updateLessonData(formData);
      goToStep(2);
    }
  };

  return (
    <div className='min-h-screen bg-neutral-50 p-6'>
      <div className='max-w-7xl m-auto'>
        {/* Main Content - 2 Column Layout */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Left Column - Form */}
          <div className='space-y-6'>
            <div className='bg-white rounded-lg border border-neutral-200 p-6 space-y-6'>
              <SubjectSelect
                value={formData.subject}
                onChange={(value) => updateField('subject', value)}
                error={errors.subject}
              />

              <LessonSelect
                subject={formData.subject}
                value={formData.lesson}
                onChange={(value) => updateField('lesson', value)}
                error={errors.lesson}
              />

              <hr className='mt-8' />
              <div className='text-center py-0 mb-4 pt-0 text-sm text-gray-700 italic'>
                Set your VR lesson's duration, the lesson will end if any task exceeds this duration.
                <br />
                Maximum duration: 60 minutes.
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
              <MapSelect value={formData.map} onChange={(value) => updateField('map', value)} error={errors.map} />

              <MapPreview selectedMapId={formData.map} />
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
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
