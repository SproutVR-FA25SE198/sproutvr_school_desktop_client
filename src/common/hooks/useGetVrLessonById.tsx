import { useQuery } from '@tanstack/react-query';
import { MAPS_STALE_TIME } from '../services/map.service';
import { GET_VR_LESSON_BY_ID_QUERY_KEY, getVrLessonById, getVrLessonPresetFile } from '../services/vr-lesson.service';

const useGetVrLessonById = (lessonId: string) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [GET_VR_LESSON_BY_ID_QUERY_KEY, lessonId],
    queryFn: async () => await getVrLessonById(lessonId!),
    staleTime: MAPS_STALE_TIME,
    refetchOnWindowFocus: false,
  });

  return { data, isLoading, isError, refetch };
};

const useGetVrLessonPresetFile = (presetFilePath: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [GET_VR_LESSON_BY_ID_QUERY_KEY, presetFilePath],
    queryFn: async () => await getVrLessonPresetFile(presetFilePath!),
    staleTime: MAPS_STALE_TIME,
    refetchOnWindowFocus: false,
  });

  return { data, isLoading, isError };
};

export default useGetVrLessonById;
export { useGetVrLessonPresetFile };
