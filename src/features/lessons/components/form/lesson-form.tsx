'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { lessonCreationSchema, type LessonCreationPayload } from './schema';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Textarea } from '@/common/components/ui/textarea';
import { Label } from '@/common/components/ui/label';
import { SubjectSelector } from './subject-selector';
import { FileUpload } from './file-upload';
import { useState } from 'react';

interface LessonFormProps {
  onSubmit?: (data: LessonCreationPayload) => void;
}

export function LessonForm({ onSubmit }: LessonFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(lessonCreationSchema),
    mode: 'onSubmit',
  });

  const handleFormSubmit = async (data: LessonCreationPayload) => {
    setIsSubmitting(true);
    try {
      console.log('Lesson Creation Payload:', data);
      if (onSubmit) {
        onSubmit(data);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-6'>
      {/* Lesson Name */}
      <div className='flex gap-12 justify-between'>
        <div className='space-y-2 w-full'>
          <Label htmlFor='name' className='text-base font-semibold'>
            Tên lớp
          </Label>
          <Input
            id='name'
            placeholder='Nhập tên lớp học'
            {...register('name')}
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && <p className='text-sm text-red-500'>{errors.name.message as string}</p>}
        </div>

        {/* Subject Selector */}
        <div>
          <SubjectSelector control={control} error={errors.subjectId?.message as string} />
        </div>
      </div>
      {/* Description */}
      <div className='space-y-2'>
        <Label htmlFor='description' className='text-base font-semibold'>
          Description
        </Label>
        <Textarea
          id='description'
          placeholder='Enter lesson description (max 1000 characters)'
          {...register('description')}
          className={`resize-none ${errors.description ? 'border-red-500' : ''}`}
          rows={2}
        />
        {errors.description && <p className='text-sm text-red-500'>{errors.description.message as string}</p>}
      </div>

      {/* File Upload */}
      <div>
        <FileUpload control={control} error={errors.resourceFile?.message as string} />
      </div>

      {/* Footer Buttons */}
      <div className='flex justify-center gap-4 pt-6'>
        <Button type='button' variant='outline' onClick={handleClear} className='min-w-32 bg-transparent'>
          Clear
        </Button>
        <Button type='submit' disabled={!isValid || isSubmitting} className='min-w-32'>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
}
