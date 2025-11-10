'use client';

import type { TaskData } from '@/common/contexts/form-context';
import type { VrTaskCreatePayload } from '@/common/types/vr-lesson.type';
import { useState, useCallback } from 'react';

// 🔹 Define only the editable fields here (you'll attach vrLessonId separately)
export interface TaskFormData extends Omit<VrTaskCreatePayload, 'vrLessonId' | 'taskNumber'> {}

export interface TaskFormErrors {
  name?: string;
  description?: string;
  taskLocationId?: string;
  mapObjectId?: string;
  activityTypeId?: string;
}

export const useStepTwoForm = (
  initialTasks: Record<number, TaskData>,
  onUpdateTask: (taskNumber: number, data: Partial<TaskData>) => void,
) => {
  const [tasks, setTasks] = useState<TaskFormData[]>(
    Object.keys(initialTasks || {})
      .sort((a, b) => +a - +b)
      .map((k) => {
        const task = initialTasks[+k];
        return {
          name: task?.taskName || '',
          description: task?.description || '',
          taskLocationId: task?.taskLocation || '',
          mapObjectId: task?.object || '',
          activityTypeId: task?.activity || '',
        };
      }),
  );

  const [errors, setErrors] = useState<TaskFormErrors[]>([]);

  /** ✅ Validate one task */
  const validateTask = useCallback((task: TaskFormData): TaskFormErrors => {
    const newErrors: TaskFormErrors = {};
    if (!task.description.trim()) newErrors.description = 'Xin hãy nhập mô tả nhiệm vụ';
    if (!task.taskLocationId) newErrors.taskLocationId = 'Xin hãy chọn vị trí nhiệm vụ';
    if (!task.mapObjectId) newErrors.mapObjectId = 'Xin hãy chọn đồ vật';
    if (!task.activityTypeId) newErrors.activityTypeId = 'Xin hãy chọn hoạt động';
    return newErrors;
  }, []);

  /** ✅ Validate all tasks */
  const validateAll = useCallback((): boolean => {
    const newErrors = tasks.map(validateTask);
    setErrors(newErrors);
    return newErrors.every((e) => Object.keys(e).length === 0);
  }, [tasks, validateTask]);

  /** ✅ Check if all tasks are valid */
  const isValid = useCallback(
    () => tasks.every((t) => Object.keys(validateTask(t)).length === 0),
    [tasks, validateTask],
  );

  /** ✅ Update field in a specific task */
  const updateField = useCallback(
    (index: number, field: keyof TaskFormData, value: string) => {
      setTasks((prev) =>
        prev.map((task, i) => {
          if (i !== index) return task;
          const updated = { ...task, [field]: value };

          // 🔹 Sync entire task into context
          onUpdateTask(i + 1, {
            description: updated.description,
            taskLocation: updated.taskLocationId,
            object: updated.mapObjectId,
            activity: updated.activityTypeId,
          });

          return updated;
        }),
      );

      // clear field-specific error
      if (errors[index]?.[field as keyof TaskFormErrors]) {
        setErrors((prev) =>
          prev.map((err, i) => (i === index ? { ...err, [field as keyof TaskFormErrors]: undefined } : err)),
        );
      }
    },
    [errors, onUpdateTask],
  );

  /** ✅ Add a new empty task */
  const addTask = useCallback(() => {
    setTasks((prev) => [
      ...prev,
      { name: '', description: '', taskLocationId: '', mapObjectId: '', activityTypeId: '' },
    ]);
    setErrors((prev) => [...prev, {}]);
  }, []);

  /** ✅ Remove a task by index */
  const removeTask = useCallback((index: number) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
    setErrors((prev) => prev.filter((_, i) => i !== index));
  }, []);

  /** ✅ Reset all */
  const reset = useCallback(() => {
    setTasks([{ description: '', taskLocationId: '', mapObjectId: '', activityTypeId: '' }]);
    setErrors([]);
  }, []);

  /** ✅ Build final payload (for submitting to API) */
  const buildPayload = useCallback(
    (vrLessonId: string): VrTaskCreatePayload[] =>
      tasks.map((t, i) => ({
        ...t,
        vrLessonId,
        taskNumber: i + 1,
      })),
    [tasks],
  );

  return {
    tasks,
    errors,
    updateField,
    addTask,
    removeTask,
    validateAll,
    isValid: isValid(),
    reset,
    buildPayload,
  };
};
