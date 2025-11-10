'use client';

import { useMutation } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { createVrLessonPhaseOne } from '../services/vr-lesson.service';
import type { VrLessonCreatePayload } from '@/common/types/vr-lesson.type';

export interface Step3FormData {
  name: string;
  description: string;
}

export interface Step3FormErrors {
  name?: string;
  description?: string;
}

export function useStepThreeForm(initialData: Step3FormData, onUpdate: (data: Partial<Step3FormData>) => void) {
  const [formData, setFormData] = useState<Step3FormData>(initialData);
  const [errors, setErrors] = useState<Step3FormErrors>({});

  const { mutate: createVrLessonPhaseOneMutate, isPending } = useMutation({
    mutationFn: (data: VrLessonCreatePayload) => createVrLessonPhaseOne(data),
  });

  const validateField = useCallback(
    (field: keyof Step3FormData, value: string) => {
      const newErrors = { ...errors };

      if (field === 'name') {
        if (!value.trim()) {
          newErrors.name = 'Xin hãy nhập tên bài học';
        } else {
          delete newErrors.name;
        }
      }

      if (field === 'description') {
        if (!value.trim()) {
          newErrors.description = 'Xin hãy nhập mô tả';
        } else {
          delete newErrors.description;
        }
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [errors],
  );

  const updateField = useCallback(
    (field: keyof Step3FormData, value: string) => {
      setFormData((prev) => {
        const updated = { ...prev, [field]: value };
        onUpdate(updated); // 🔹 Sync with context
        return updated;
      });
      validateField(field, value);
    },
    [validateField],
  );

  const isValid = formData.name.trim() !== '' && formData.description.trim() !== '';

  return {
    formData,
    updateField,
    errors,
    isValid,
    createVrLessonPhaseOneMutate,
    isPending,
  };
}
