import { useQuery } from '@tanstack/react-query';
import { GET_ACTIVITY_TYPES_BY_OBJECT_QUERY__KEY, getActivityTypes, MAPS_STALE_TIME } from '../services/map.service';

const useGetActivityTypes = ({ objectId }: { objectId: string }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [GET_ACTIVITY_TYPES_BY_OBJECT_QUERY__KEY, objectId],
    queryFn: async () => await getActivityTypes(objectId),
    staleTime: MAPS_STALE_TIME,
    refetchOnWindowFocus: false,
  });

  return { data, isLoading, isError };
};

export default useGetActivityTypes;
