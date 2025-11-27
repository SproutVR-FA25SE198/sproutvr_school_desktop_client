'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { lessonCreationSchema, type LessonFormData } from './schema';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Textarea } from '@/common/components/ui/textarea';
import { Label } from '@/common/components/ui/label';
import { SubjectSelector } from './subject-selector';
import { FileUpload } from './file-upload';
import { useState } from 'react';
import type { MasterSubjectRetrieve, SubjectRetrieve } from '@/common/services/subject.service';
import { ClassSelector } from './class-selector';

interface LessonFormProps {
  onSubmit?: (data: LessonFormData) => void;
  masterSubjects?: MasterSubjectRetrieve[];
  subjects?: SubjectRetrieve[];
}

export function LessonForm({ onSubmit, masterSubjects, subjects }: LessonFormProps) {
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

  const selectedSubjectId = useWatch({
    control,
    name: 'subjectId',
  });

  const handleFormSubmit = async (data: LessonFormData) => {
    setIsSubmitting(true);
    try {
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
      <div className='space-y-2 w-full'>
        <Label htmlFor='name' className='text-base font-semibold'>
          Tên lớp
        </Label>
        <Input
          id='name'
          placeholder='Nhập tên bài giảng'
          {...register('name')}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && <p className='text-sm text-red-500'>{errors.name.message as string}</p>}
      </div>
      <div className='flex gap-24'>
        <SubjectSelector subjects={masterSubjects} control={control} error={errors.subjectId?.message as string} />
        <ClassSelector
          classes={subjects}
          control={control}
          selectedSubjectId={selectedSubjectId}
          error={errors.classId?.message as string}
        />
      </div>
      {/* Description */}
      <div className='space-y-2'>
        <Label htmlFor='description' className='text-base font-semibold'>
          Mô tả bài giảng
        </Label>
        <Textarea
          id='description'
          placeholder='Nhập mô tả lớp học (tối đa 1000 ký tự)'
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
          Xóa thông tin
        </Button>
        <Button type='submit' variant='secondary' disabled={!isValid || isSubmitting} className='min-w-32'>
          {isSubmitting ? 'Đang lưu bài giảng...' : 'Lưu bài giảng'}
        </Button>
      </div>
    </form>
  );
}
