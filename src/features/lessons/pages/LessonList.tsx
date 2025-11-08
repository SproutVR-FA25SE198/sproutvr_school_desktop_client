'use client';

import Loading from '@/common/components/loading';
import { LessonsGrid } from '../components/lesson-grid';
import useGetLessons from '../hooks/useGetLessons';
import useGetMasterSubjects from '@/common/hooks/useGetMasterSubjects';

export default function LessonsPage() {
  const {
    data,
    isLoading: isLessonsLoading,
    isError: isLessonsError,
  } = useGetLessons({
    params: { pageIndex: 1, pageSize: 50, sortBy: 'nameAsc', subjectId: '' },
  });

  const { data: subjects, isLoading: isSubjectsLoading, isError: isSubjectsError } = useGetMasterSubjects();

  const isLoading = isLessonsLoading || isSubjectsLoading;
  const isError = isLessonsError || isSubjectsError;

  console.log('error', isError);

  if (isLoading) return <Loading isLoading />;
  return (
    <div className='overflow-y-auto border-r border-neutral-200 p-8'>
      <div className=''>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h2 className='text-2xl font-bold text-neutral-900 mb-1'>Danh sách bài học</h2>
          </div>
        </div>

        <LessonsGrid lessons={data?.items} subjects={subjects?.items} />
      </div>
    </div>
  );
}
