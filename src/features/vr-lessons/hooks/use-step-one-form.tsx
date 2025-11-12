'use client';

import { HHMMSSToDuration } from '@/common/utils/duration-converter';
import { useState, useCallback } from 'react';

export interface LessonFormData {
  subject: string;
  lesson: string;
  duration: string;
  instructions: string;
  map: string;
}

export interface FormErrors {
  subject?: string;
  lesson?: string;
  duration?: string;
  instructions?: string;
  map?: string;
}

export const useStepOneForm = (initialData: LessonFormData, onUpdate: (data: Partial<LessonFormData>) => void) => {
  const [formData, setFormData] = useState<LessonFormData>(initialData);

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.subject) {
      newErrors.subject = 'Xin hãy chọn môn học';
    }

    if (!formData.lesson) {
      newErrors.lesson = 'Xin hãy nhập tên bài học';
    }

    if (!formData.duration) {
      newErrors.duration = 'Xin hãy nhập thời lượng';
    } else {
      const duration = Number.parseInt(formData.duration, 10);
      if (isNaN(duration) || duration < 5 || duration > 60) {
        newErrors.duration = 'Thời lượng phải từ 5 đến 60 phút';
      }
    }

    if (!formData.instructions) {
      newErrors.instructions = 'Xin hãy nhập hướng dẫn';
    }

    if (!formData.map) {
      newErrors.map = 'Xin hãy chọn bản đồ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const isValid = useCallback((): boolean => {
    const duration: { minutes: number; seconds: number } = HHMMSSToDuration(formData.duration) || {
      minutes: 0,
      seconds: 0,
    };
    return (
      formData.subject !== '' &&
      formData.lesson !== '' &&
      formData.duration !== '' &&
      // formData.instructions !== '' &&
      formData.map !== '' &&
      duration.minutes >= 1 &&
      duration.minutes <= 60
    );
  }, [formData]);

  const updateField = useCallback(
    (field: keyof LessonFormData, value: string) => {
      setFormData((prev) => {
        const updated = { ...prev, [field]: value };
        onUpdate(updated); // 🔹 Keep context in sync
        return updated;
      });
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    [errors, onUpdate],
  );

  const reset = useCallback(() => {
    setFormData({
      subject: '',
      lesson: '',
      duration: '',
      instructions: '',
      map: '',
    });
    setErrors({});
  }, []);

  return {
    formData,
    errors,
    updateField,
    validateForm,
    isValid: isValid(),
    reset,
  };
};
