import { useQuery } from '@tanstack/react-query';
import { GET_MAP_OBJECTS_BY_MAP_QUERY__KEY, MAPS_STALE_TIME, getMapObjectsByMap } from '../services/map.service';

const useGetMapObjects = ({ mapId, locationId }: { mapId: string; locationId: string }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [GET_MAP_OBJECTS_BY_MAP_QUERY__KEY, mapId, locationId],
    queryFn: async () => await getMapObjectsByMap(mapId, locationId),
    staleTime: MAPS_STALE_TIME,
    refetchOnWindowFocus: false,
  });

  return { data, isLoading, isError };
};

export default useGetMapObjects;
