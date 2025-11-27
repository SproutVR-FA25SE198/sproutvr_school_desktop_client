import { useQuery } from '@tanstack/react-query';
import { GET_LESSON_BY_ID_QUERY__KEY, getLessonById, LESSONS_STALE_TIME } from '../services/lesson.service';

const useGetLessonById = ({ lessonId }: { lessonId: string }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [GET_LESSON_BY_ID_QUERY__KEY, lessonId],
    queryFn: async () => await getLessonById(lessonId),
    staleTime: LESSONS_STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  return { data, isLoading, isError };
};

export default useGetLessonById;
