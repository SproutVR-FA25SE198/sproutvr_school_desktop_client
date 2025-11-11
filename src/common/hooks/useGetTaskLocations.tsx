import { useQuery } from '@tanstack/react-query';
import { GET_TASK_LOCATIONS_BY_MAP_QUERY__KEY, MAPS_STALE_TIME, getTaskLocationsByMap } from '../services/map.service';

const useGetTaskLocations = ({ mapId }: { mapId: string }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [GET_TASK_LOCATIONS_BY_MAP_QUERY__KEY, mapId],
    queryFn: async () => await getTaskLocationsByMap(mapId),
    staleTime: MAPS_STALE_TIME,
    refetchOnWindowFocus: false,
  });

  return { data, isLoading, isError };
};

export default useGetTaskLocations;
