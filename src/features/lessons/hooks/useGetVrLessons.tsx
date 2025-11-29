import { useQuery } from '@tanstack/react-query';
import { GET_VR_LESSON_LIST_QUERY__KEY, getVrLessonList } from '../services/lesson.service';

const useGetVrLessons = ({ lessonId = '' }: { lessonId?: string }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [GET_VR_LESSON_LIST_QUERY__KEY, lessonId],
    queryFn: async () => await getVrLessonList(lessonId),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  return { data, isLoading, isError };
};

export default useGetVrLessons;
