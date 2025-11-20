import { useQuery } from '@tanstack/react-query';
import {
  GET_LESSON_LIST_QUERY__KEY,
  getLessonList,
  LESSONS_STALE_TIME,
  type LessonRetrieveParams,
} from '../services/lesson.service';

const useGetLessons = ({ params }: { params: LessonRetrieveParams }) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [GET_LESSON_LIST_QUERY__KEY, params.pageIndex, params.pageSize, params.sortBy, params.subjectId],
    queryFn: async () => await getLessonList(params),
    staleTime: LESSONS_STALE_TIME,
    refetchOnWindowFocus: false,
  });

  return { data, isLoading, isError, refetch };
};

export default useGetLessons;
