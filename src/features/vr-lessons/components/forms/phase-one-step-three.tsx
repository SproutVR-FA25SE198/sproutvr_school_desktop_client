'use client';

import { useFormContext } from '@/common/contexts/form-context';
import { useStepThreeForm } from '../../hooks/use-step-three-form';
import { Button } from '@/common/components/ui/button';
import { VrLessonDescriptionTextarea } from '../vr-lesson-description-textarea';
import { VrLessonNameInput } from '../vr-lesson-name-input';
import type { VrLessonCreatePayload, VrTaskCreatePayload } from '@/common/types/vr-lesson.type';

export function PhaseOneStepThree() {
  const { lessonData, updateLessonData, goToStep, submitForm, tasks } = useFormContext();
  const {
    formData,
    updateField,
    errors,
    isValid,
    // createVrLessonPhaseOneMutate, isPending
  } = useStepThreeForm({ name: lessonData.name, description: lessonData.description }, updateLessonData);

  const handleBack = () => {
    goToStep(2);
  };

  const handleSave = () => {
    if (isValid) {
      updateLessonData({
        name: formData.name,
        description: formData.description,
      });
      submitForm();
      const payload: VrLessonCreatePayload = {
        name: formData.name,
        description: formData.description,
        maxDuration: lessonData.duration,
        lessonId: 'c1111111-1111-1111-1111-111111111111',
        mapId: 'a0000001-0000-0000-0000-000000000001',
        tasks: Object.values(tasks).map((task, index) => ({
          description: task.description,
          activityTypeId: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
          mapObjectId: 'b0000001-0000-0000-0000-000000000005',
          taskLocationId: 'c0000001-0000-0000-0000-000000000004',
          taskNumber: index + 1,
        })) as VrTaskCreatePayload[],
      };
      console.log('Submitting VR Lesson Payload:', payload);
      // const result = createVrLessonPhaseOneMutate(payload);
      // console.log(result);
      // submitForm(payload);
      goToStep(4);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4'>
      <div className='w-full max-w-2xl'>
        {/* Main Card */}
        <div className='bg-white rounded-lg shadow-xl p-8 space-y-6'>
          {/* Title */}
          <div className='text-center mb-8'>
            <h2 className='text-xl font-semibold text-slate-700'>Save your VR Lesson</h2>
          </div>

          {/* Teacher Instructions Display */}
          <div className='bg-slate-100 rounded-lg p-4'>
            <p className='text-sm text-slate-600 text-center'>
              Save your VR Lesson, then add the details for each task later on.
            </p>
          </div>

          {/* Form Fields */}
          <div className='space-y-6'>
            <VrLessonNameInput
              value={formData.name}
              onChange={(value) => updateField('name', value)}
              error={errors.name}
            />

            <VrLessonDescriptionTextarea
              value={formData.description}
              onChange={(value) => updateField('description', value)}
              error={errors.description}
            />
          </div>

          {/* Buttons */}
          <div className='flex justify-center gap-4 pt-6'>
            <Button onClick={handleBack} variant='outline' className='px-8 bg-transparent'>
              ← Back
            </Button>
            <Button onClick={handleSave} disabled={!isValid} className='px-8'>
              Save →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
