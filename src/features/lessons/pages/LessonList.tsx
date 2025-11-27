'use client';

import Loading from '@/common/components/loading';
import { LessonsGrid } from '../components/lesson-grid';
import useGetLessons from '../hooks/useGetLessons';
import useGetMasterSubjects from '@/common/hooks/useGetMasterSubjects';
import { useLocation, useNavigate } from 'react-router-dom';

export default function LessonsPage() {
  const locations = useLocation();
  const navigate = useNavigate();

  const lessonQueryParams = {
    pageIndex: 1,
    pageSize: 50,
    sortBy: 'nameAsc',
    subjectId: '',
  };

  const {
    data,
    isLoading: isLessonsLoading,
    isError: isLessonsError,
    refetch,
  } = useGetLessons({
    params: lessonQueryParams,
  });

  if (locations.state && (locations.state as any).refresh) {
    refetch().then(() => {
      navigate('.', { replace: true, state: {} });
    });
  }

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
            <h2 className='text-2xl font-bold text-neutral-900 mb-1'>Danh sách bài giảng</h2>
          </div>
        </div>

        <LessonsGrid lessons={data?.items} subjects={subjects?.items} />
      </div>
    </div>
  );
}
