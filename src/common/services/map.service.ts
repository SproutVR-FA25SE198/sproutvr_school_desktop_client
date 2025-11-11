import http from '../utils/http';
import {
  type MapObjectRetrieveResponse,
  type ActivityTypeRetrieveResponse,
  type MapRetrieveResponse,
  type TaskLocationRetrieveResponse,
} from '../types/map.type';

export const GET_MAPS_BY_SUBJECT_QUERY__KEY = 'GET_MAPS_BY_SUBJECT_QUERY__KEY';
export const GET_TASK_LOCATIONS_BY_MAP_QUERY__KEY = 'GET_TASK_LOCATIONS_BY_MAP_QUERY__KEY';
export const GET_MAP_OBJECTS_BY_MAP_QUERY__KEY = 'GET_MAP_OBJECTS_BY_MAP_QUERY__KEY';
export const GET_ACTIVITY_TYPES_BY_OBJECT_QUERY__KEY = 'GET_ACTIVITY_TYPES_BY_OBJECT_QUERY__KEY';
export const MAPS_STALE_TIME = 5 * 60 * 1000; // 5 minutes

export const getMapsBySubject = async ({ subjectId }: { subjectId: string }) => {
  const result = await http.get<MapRetrieveResponse>(
    `/api/v1/authorized/maps?subjectId=${subjectId}&isPaginated=false`,
  );
  return result.data;
};

export const getTaskLocationsByMap = async (mapId: string) => {
  const result = await http.get<TaskLocationRetrieveResponse>(
    `/api/v1/authorized/task-locations?isPaginated=false&mapId=${mapId}`,
  );
  return result.data;
};

export const getMapObjectsByMap = async (mapId: string, locationId: string) => {
  const result = await http.get<MapObjectRetrieveResponse>(
    `/api/v1/authorized/map-objects?isPaginated=false&mapId=${mapId}&taskLocationId=${locationId}`,
  );
  return result.data;
};

export const getActivityTypes = async (objectId: string) => {
  const result = await http.get<ActivityTypeRetrieveResponse>(
    `/api/v1/authorized/activity-types?isPaginated=true&mapObjectId=${objectId}`,
  );
  return result.data;
};
