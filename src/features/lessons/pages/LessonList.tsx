'use client';

import Loading from '@/common/components/loading';
import { LessonsGrid } from '../components/lesson-grid';
import useGetLessons from '../hooks/useGetLessons';
import useGetMasterSubjects from '@/common/hooks/useGetMasterSubjects';
import { useLocation, useNavigate } from 'react-router-dom';

export default function LessonsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    data: lessonData,
    isLoading: isLessonsLoading,
    isError: isLessonsError,
    refetch,
  } = useGetLessons({
    params: {
      pageIndex: 1,
      pageSize: 100,
      sortBy: 'nameAsc',
      subjectId: '',
    },
  });

  if (location.state?.refresh) {
    refetch().then(() => {
      navigate('.', { replace: true, state: {} });
    });
  }

  const {
    data: subjectsData,
    isLoading: isSubjectsLoading,
    isError: isSubjectsError,
  } = useGetMasterSubjects();

  if (isLessonsLoading || isSubjectsLoading) return <Loading isLoading />;

  return (
    <div className="p-8 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6">Danh sách bài giảng</h2>

      <LessonsGrid
        lessons={lessonData?.items || []}
        subjects={subjectsData?.items || []}
      />
    </div>
  );
}
