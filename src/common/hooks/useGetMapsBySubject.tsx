import { useQuery } from '@tanstack/react-query';
import { GET_MAPS_BY_SUBJECT_QUERY__KEY, MAPS_STALE_TIME, getMapsBySubject } from '../services/map.service';

const useGetMapsBySubject = ({ subjectId }: { subjectId: string }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [GET_MAPS_BY_SUBJECT_QUERY__KEY, subjectId],
    queryFn: async () => await getMapsBySubject({ subjectId }),
    staleTime: MAPS_STALE_TIME,
    refetchOnWindowFocus: false,
  });

  return { data, isLoading, isError };
};

export default useGetMapsBySubject;
