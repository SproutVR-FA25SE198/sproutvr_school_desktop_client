'use client';
import { useState } from 'react';
import { useFormContext } from '@/common/contexts/form-context';
import { TaskSelector } from '../task-selector';
import { DescriptionInput } from '../description-input';
import { TaskLocationSelect } from '../task-location-select';
import { ObjectSelect } from '../object-select';
import { ActivitySelect } from '../activity-select';
import { ObjectPreview } from '../object-preview';
import { MapPreview } from '../map-preview';
import { Button } from '@/common/components/ui/button';
import { useStepTwoForm } from '../../hooks/use-step-two-form';
import { Trash2 } from 'lucide-react';
import type { MapRetrieveResponse } from '@/common/types/map.type';
import useGetTaskLocations from '@/common/hooks/useGetTaskLocations';
import Loading from '@/common/components/loading';
import useGetMapObjects from '@/common/hooks/useGetMapObjects';
import useGetActivityTypes from '@/common/hooks/useGetActivityTypes';
import { toast } from 'sonner';

export function PhaseOneStepTwo({
  maps,
  // locations,
}: {
  maps: MapRetrieveResponse;
  // locations: TaskLocationRetrieveResponse;
}) {
  const { tasks, updateTask, goToStep, lessonData } = useFormContext();
  const {
    tasks: formTasks,
    updateField,
    validateAll,
    addTask,
    removeTask,
    reset,
    buildPayload,
    errors,
  } = useStepTwoForm(tasks, updateTask);

  // Track which task (by index) user is currently editing
  const [selectedTask, setSelectedTask] = useState(0);

  const { data: locations, isLoading: isLocationsLoading } = useGetTaskLocations({ mapId: lessonData.map || '' });

  const { data: objects, isLoading: isObjectsLoading } = useGetMapObjects({
    mapId: lessonData.map || '',
    locationId: formTasks[selectedTask]?.taskLocationId || '',
  });

  const { data: activityTypes, isLoading: isActivityTypesLoading } = useGetActivityTypes({
    objectId: formTasks[selectedTask]?.mapObjectId || '',
  });

  // Compute which locations are already used by other tasks
  const blockedLocations = Object.values(formTasks)
    .map((t) => t.taskLocationId)
    .filter((id) => id !== '' && id !== formTasks[selectedTask]?.taskLocationId);

  /** --------------------------- Actions --------------------------- */

  const handleAddTask = () => {
    if (!validateAll()) return;

    if (formTasks.length >= (locations?.items.length || 0)) {
      toast.info('Số nhiệm vụ đã đạt giới hạn của Bản đồ này.');
      return;
    }

    addTask();
    setSelectedTask(formTasks.length); // auto-select new task
  };

  const handleRemoveTask = (index: number) => {
    if (formTasks.length > 1) {
      removeTask(index);
      setSelectedTask(Math.max(0, index - 1));
    }
  };

  const handleTaskSelect = (index: number) => {
    if (validateAll()) {
      // persist the currently edited task to context (optional)
      updateTask(selectedTask + 1, tasks[selectedTask]);
      setSelectedTask(index);
    }
  };

  const handleClear = () => {
    reset();
  };

  const handleBack = () => {
    if (validateAll()) {
      const payload = buildPayload('vrLesson-1');
      payload.forEach((task, i) => updateTask(i + 1, task));
    }
    goToStep(1);
  };

  const handleNext = () => {
    if (validateAll()) {
      const payload = buildPayload('vrLesson-1');
      payload.forEach((task, i) => updateTask(i + 1, task));
      goToStep(3);
    }
  };

  /** --------------------------- Render --------------------------- */

  const currentTask = formTasks[selectedTask];
  const currentError = errors[selectedTask] || {};
  const isLoading = isLocationsLoading || isObjectsLoading || isActivityTypesLoading;

  if (isLoading) return <Loading isLoading />;

  return (
    <div className='bg-neutral-50 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Main Content */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Left Column - Map + Instruction */}
          <div className='space-y-6'>
            <div className='bg-white rounded-lg border border-neutral-200 p-6 space-y-4'>
              <MapPreview
                isLocationPreview={true}
                selectedLocationId={currentTask.taskLocationId}
                selectedMapId={lessonData.map}
                locationPreviewUrl={locations?.items[0]?.map.previewUrl}
                maps={maps?.items.filter((m) => m.status.key === 1) || []}
                locations={locations?.items || []}
              />
            </div>

            <div className='bg-gray-200 rounded-lg border border-neutral-200 p-6'>
              Bạn có thể gán nhiều nhiệm vụ cho bài học VR này. Mỗi nhiệm vụ sẽ hướng dẫn học sinh tương tác với các đồ
              vật cụ thể trong môi trường VR dựa trên loại hoạt động bạn chọn.
              <br />
              <strong>Số lượng nhiệm vụ tối đa sẽ tùy thuộc vào bản đồ bạn chọn.</strong>
            </div>
          </div>

          {/* Right Column - Task Form */}
          <div className='space-y-6'>
            <div className='bg-white rounded-lg border border-neutral-200 p-6 space-y-6'>
              {/* Task Selector */}
              <div className='flex items-center justify-between'>
                <TaskSelector
                  selectedTask={selectedTask + 1}
                  totalTasks={formTasks.length}
                  onTaskSelect={(i) => handleTaskSelect(i - 1)}
                  onAddTask={handleAddTask}
                />
                {/* Remove Task Button */}
                {formTasks.length > 1 && (
                  <Button
                    variant='link'
                    onClick={() => handleRemoveTask(selectedTask)}
                    className='p-0 m-0 bg-transparent text-destructive hover:text-destructive/50 hover:cursor-pointer hover:underline '
                  >
                    <Trash2 className='w-36 h-36' />
                    <span className='text-sm'>Xóa nhiệm vụ</span>
                  </Button>
                )}
              </div>
              <DescriptionInput
                value={currentTask.description}
                onChange={(v) => updateField(selectedTask, 'description', v)}
                error={currentError.description}
              />

              <TaskLocationSelect
                value={currentTask.taskLocationId}
                locations={locations?.items || []}
                blockedLocations={blockedLocations}
                onChange={(v) => updateField(selectedTask, 'taskLocationId', v)}
                error={currentError.taskLocationId}
              />

              <div className='grid grid-cols-1 py-3 md:grid-cols-2 gap-4'>
                <div className='space-y-4'>
                  <ObjectSelect
                    objects={objects?.items || []}
                    value={currentTask.mapObjectId}
                    onChange={(v) => updateField(selectedTask, 'mapObjectId', v)}
                    error={currentError.mapObjectId}
                  />

                  <ActivitySelect
                    value={currentTask.activityTypeId}
                    activityTypes={activityTypes?.items || []}
                    onChange={(v) => updateField(selectedTask, 'activityTypeId', v)}
                    error={currentError.activityTypeId}
                  />
                </div>

                {/* Object Preview */}
                <ObjectPreview objects={objects?.items || []} selectedObjectId={currentTask.mapObjectId} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className='mt-8 flex justify-between'>
          <Button
            onClick={handleBack}
            variant='outline'
            className='px-8 py-2 border border-neutral-300 text-neutral-700 rounded-md font-medium hover:bg-neutral-50 bg-transparent'
          >
            Quay lại
          </Button>

          <div className='flex gap-4'>
            <Button
              onClick={handleClear}
              variant='outline'
              className='px-8 py-2 border border-neutral-300 text-neutral-700 rounded-md font-medium hover:bg-neutral-50 bg-transparent'
            >
              Xóa
            </Button>

            <Button
              onClick={handleNext}
              className='px-8 py-2 bg-primary hover:bg-primary-light text-white rounded-md font-medium'
            >
              Tiếp theo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
