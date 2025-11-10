import { useQuery } from '@tanstack/react-query';
import { MAPS_STALE_TIME } from '../services/map.service';
import { GET_VR_LESSON_BY_ID_QUERY_KEY, getVrLessonById } from '../services/vr-lesson.service';

const useGetVrLessonById = (lessonId: string) => {
  console.log('useGetVrLessonById called with lessonId:', lessonId);
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [GET_VR_LESSON_BY_ID_QUERY_KEY, lessonId],
    queryFn: async () => await getVrLessonById(lessonId!),
    staleTime: MAPS_STALE_TIME,
    refetchOnWindowFocus: false,
  });

  return { data, isLoading, isError, refetch };
};

export default useGetVrLessonById;
