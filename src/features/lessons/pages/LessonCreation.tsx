'use client';

import { Card } from '@/common/components/ui/card';
import { LessonForm } from '../components/form/lesson-form';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import type { LessonCreationPayload } from '../components/form/schema';

export default function LessonCreationPage() {
  const handleBack = () => {
    window.history.back();
  };

  const handleSubmit = (data: LessonCreationPayload) => {
    console.log('Form submitted with data:', data);
    // Here you would typically send the data to your backend
    // Then navigate to a success page or lessons list
  };

  return (
    <div className='mx-auto container w-full space-y-6 p-8'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Button variant='ghost' size='icon' onClick={handleBack} className='rounded-full bg-white shadow-sm'>
          <ChevronLeft className='size-5' />
        </Button>
        <h1 className='text-3xl self-center font-bold text-neutral-900'>Tạo lớp học mới</h1>
      </div>

      {/* Form Card */}
      <Card className='p-8 w-full'>
        <LessonForm onSubmit={handleSubmit} />
      </Card>
    </div>
  );
}
