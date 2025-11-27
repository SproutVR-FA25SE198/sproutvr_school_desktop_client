'use client';

import { Card } from '@/common/components/ui/card';
import { LessonForm } from '../components/form/lesson-form';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import type { LessonFormData } from '../components/form/schema';
import useGetMasterSubjects from '@/common/hooks/useGetMasterSubjects';
import useGetSubjects from '@/common/hooks/useGetSubjects';
import Loading from '@/common/components/loading';
import { useMutation } from '@tanstack/react-query';
import { createLesson, type LessonCreationPayload } from '../services/lesson.service';
import { useNavigate } from 'react-router-dom';
import routes from '@/core/configs/routes';
import useGetLessons from '../hooks/useGetLessons';

export default function LessonCreationPage() {
  const {
    data: masterSubjects,
    isLoading: isMasterSubjectsLoading,
    isError: isMasterSubjectsError,
  } = useGetMasterSubjects();

  const navigate = useNavigate();

  const { data: subjects, isLoading: isSubjectsLoading, isError: isSubjectsError } = useGetSubjects();
  const { refetch: refetchLessons } = useGetLessons({
    params: { pageIndex: 1, pageSize: 50, sortBy: 'nameAsc', subjectId: '' },
  });

  const { mutate: createLessonMutation, isPending } = useMutation({
    mutationFn: async (data: LessonCreationPayload) => await createLesson(data),
    onSuccess: (data) => {
      navigate(routes.lessonDetails.replace(':id', data.id));
    },
  });

  const isLoading = isMasterSubjectsLoading || isSubjectsLoading || isPending;

  const isError = isMasterSubjectsError || isSubjectsError;
  console.error(isError);

  const handleBack = () => {
    window.history.back();
  };

  const handleSubmit = (data: LessonFormData) => {
    const payload = {
      subjectId: data.classId,
      name: data.name,
      description: data.description,
      resourceFile: data.resourceFile,
      teacherId: '0199f4b1-8487-4352-8a2a-320a00e40e58',
    };

    createLessonMutation(payload);
    refetchLessons();
    // Here you would typically send the data to your backend
    // Then navigate to a success page or lessons list
  };

  if (isLoading) return <Loading isLoading />;

  return (
    <div className='mx-auto container w-full space-y-6 p-8 mt-16'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Button variant='ghost' size='icon' onClick={handleBack} className='rounded-full bg-white shadow-sm'>
          <ChevronLeft className='size-5' />
        </Button>
        <h1 className='text-3xl self-center font-bold text-neutral-900'>Tạo bài giảng mới</h1>
      </div>

      {/* Form Card */}
      <Card className='p-8 w-full'>
        <LessonForm masterSubjects={masterSubjects?.items} subjects={subjects?.items} onSubmit={handleSubmit} />
      </Card>
    </div>
  );
}
