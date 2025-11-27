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
import { useSelector } from 'react-redux';
import type { RootState } from '@/common/store';

export default function LessonCreationPage() {
  const {
    data: masterSubjects,
    isLoading: isMasterSubjectsLoading,
    isError: isMasterSubjectsError,
  } = useGetMasterSubjects();

  const navigate = useNavigate();

  const { user } = useSelector((state: RootState) => state.auth);

  const { data: subjects, isLoading: isSubjectsLoading, isError: isSubjectsError } = useGetSubjects();

  const { mutate: createLessonMutation, isPending } = useMutation({
    mutationFn: async (data: LessonCreationPayload) => await createLesson(data),
    onSuccess: (data) => {
      navigate(routes.lessonDetails.replace(':id', data.id));
    },
  });

  const isLoading = isMasterSubjectsLoading || isSubjectsLoading || isPending;
  const isError = isMasterSubjectsError || isSubjectsError;

  if (isError) {
    alert('Đã có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.');
    navigate(routes.home);
  }

  const handleBack = () => {
    window.history.back();
  };

  const handleSubmit = (data: LessonFormData) => {
    const payload = {
      subjectId: data.classId,
      name: data.name,
      description: data.description,
      resourceFile: data.resourceFile,
      teacherId: user?.userId,
    };

    createLessonMutation(payload);
  };

  if (isLoading) return <Loading isLoading />;

  return (
    <div className='h-screen overflow-y-auto'>
      <div className='mx-auto container w-full space-y-6 p-8 mt-4 pb-16'>
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
    </div>
  );
}
