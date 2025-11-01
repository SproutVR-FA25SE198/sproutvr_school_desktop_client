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

export function PhaseOneStepTwo() {
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

  /** --------------------------- Actions --------------------------- */

  const handleAddTask = () => {
    if (formTasks.length < 5) {
      addTask();
      setSelectedTask(formTasks.length); // select the new one
    }
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

  return (
    <div className='min-h-screen bg-neutral-50 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Main Content */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Left Column - Map + Instruction */}
          <div className='space-y-6'>
            <div className='bg-white rounded-lg border border-neutral-200 p-6 space-y-4'>
              <MapPreview selectedMapId={lessonData.map} />
            </div>

            <div className='bg-gray-200 rounded-lg border border-neutral-200 p-6'>
              You can assign multiple tasks to this VR lesson. Each task will guide the student to interact with
              specific objects in the VR environment based on the activity type you select.
              <br />
              <strong>The maximum number of tasks you can add to a single VR lesson is 5.</strong>
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
                    <span className='text-sm'>Remove Task</span>
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
                onChange={(v) => updateField(selectedTask, 'taskLocationId', v)}
                error={currentError.taskLocationId}
              />

              <div className='grid grid-cols-1 py-3 md:grid-cols-2 gap-4'>
                <div className='space-y-4'>
                  <ObjectSelect
                    value={currentTask.mapObjectId}
                    onChange={(v) => updateField(selectedTask, 'mapObjectId', v)}
                    error={currentError.mapObjectId}
                  />

                  <ActivitySelect
                    value={currentTask.activityTypeId}
                    onChange={(v) => updateField(selectedTask, 'activityTypeId', v)}
                    error={currentError.activityTypeId}
                  />
                </div>

                {/* Object Preview */}
                <ObjectPreview selectedObjectId={currentTask.mapObjectId} />
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
            Back
          </Button>

          <div className='flex gap-4'>
            <Button
              onClick={handleClear}
              variant='outline'
              className='px-8 py-2 border border-neutral-300 text-neutral-700 rounded-md font-medium hover:bg-neutral-50 bg-transparent'
            >
              Clear
            </Button>

            <Button
              onClick={handleNext}
              className='px-8 py-2 bg-primary hover:bg-primary-light text-white rounded-md font-medium'
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
