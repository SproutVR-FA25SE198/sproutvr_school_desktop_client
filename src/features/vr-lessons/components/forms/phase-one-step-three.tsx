'use client';

import { useFormContext } from '@/common/contexts/form-context';
import { useStepThreeForm } from '../../hooks/use-step-three-form';
import { Button } from '@/common/components/ui/button';
import { VrLessonDescriptionTextarea } from '../vr-lesson-description-textarea';
import { VrLessonNameInput } from '../vr-lesson-name-input';
import type { VrLessonCreatePayload, VrTaskCreatePayload } from '@/common/types/vr-lesson.type';

export function PhaseOneStepThree() {
  const { lessonData, updateLessonData, goToStep, tasks } = useFormContext();
  const { formData, updateField, errors, isValid, createVrLessonPhaseOneMutate } = useStepThreeForm(
    { name: lessonData.name, description: lessonData.description },
    updateLessonData,
  );

  const handleBack = () => {
    goToStep(2);
  };

  const handleSave = () => {
    if (isValid) {
      updateLessonData({
        name: formData.name,
        description: formData.description,
      });
      const payload: VrLessonCreatePayload = {
        name: formData.name,
        description: formData.description,
        maxDuration: lessonData.duration,
        lessonId: lessonData.lesson,
        mapId: lessonData.map,
        tasks: Object.values(tasks).map((task, index) => ({
          description: task.description,
          activityTypeId: task.activity,
          mapObjectId: task.object,
          taskLocationId: task.taskLocation,
          taskNumber: index + 1,
        })) as VrTaskCreatePayload[],
      };
      createVrLessonPhaseOneMutate(payload, {
        onSuccess: (data) => {
          updateLessonData({ id: data.id });
          goToStep(4);
        },
      });

      // submitForm(payload);
    }
  };

  return (
    <div className='bg-gradient-to-br h-[calc(100vh-97px)] from-slate-900 to-slate-800 flex items-center justify-center p-4 pt-0'>
      <div className='w-full max-w-2xl'>
        {/* Main Card */}
        <div className='bg-white rounded-lg shadow-xl p-8 space-y-6'>
          {/* Title */}
          <div className='text-center'>
            <h2 className='text-xl font-semibold text-slate-700'>Lưu bài học VR</h2>
          </div>

          {/* Teacher Instructions Display */}
          <div className='bg-slate-100 rounded-lg p-4'>
            <p className='text-sm text-slate-600 text-center'>
              Lưu bài học VR của bạn, sau đó thêm chi tiết cho từng nhiệm vụ sau.
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
              Quay lại
            </Button>
            <Button onClick={handleSave} disabled={!isValid} className='px-8'>
              Tiếp theo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
