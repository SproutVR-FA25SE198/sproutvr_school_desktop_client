import type { RetrieveAllResponse, Status } from './common.type';
import type { Subject } from './subject.type';

export interface Map {
  id: string;
  name?: string;
  description: string;
  imageUrl: string;
  subjectId: string;
  subjectName: string;
  mapCode: string;
  status: string;
}

export interface MapGeneralRetrieve extends Pick<Map, 'id' | 'name' | 'mapCode' | 'imageUrl'> {}

export interface MapObject {
  id: string;
  name: string;
  mapId?: string;
  imageUrl?: string;
  objectCode: string;
}

export interface ActivityType {
  id: string;
  name: string;
  activityCode: string;
}

export interface TaskLocation {
  id: string;
  name: string;
  mapId?: string;
  locationCode: string;
  imageUrl?: string;
}

export interface MapRetrieve {
  id: string;
  name: string;
  imageUrl: string;
  mapCode: string;
  status: Status;
  subject: Pick<Subject, 'id' | 'name' | 'description' | 'imageUrl'>;
  createdAtUtc: string;
  createdAtVietnam: string;
}

export interface MapRetrieveResponse extends RetrieveAllResponse<MapRetrieve> {}

export interface MapWithPreviewUrl extends Pick<Map, 'id' | 'name' | 'mapCode' | 'imageUrl'> {
  previewUrl: string;
}

export interface TaskLocationRetrieve extends Pick<TaskLocation, 'id' | 'name' | 'locationCode' | 'imageUrl'> {
  map: MapWithPreviewUrl;
  createdAtUtc: string;
  createdAtVietnam: string;
}

export interface TaskLocationRetrieveResponse extends RetrieveAllResponse<TaskLocationRetrieve> {}

export interface MapObjectRetrieve extends Pick<MapObject, 'id' | 'name' | 'objectCode' | 'imageUrl'> {
  map: MapWithPreviewUrl;
  createdAtUtc: string;
  createdAtVietnam: string;
}

export interface MapObjectRetrieveResponse extends RetrieveAllResponse<MapObjectRetrieve> {}

export interface ActivityTypeRetrieve extends Pick<ActivityType, 'id' | 'name' | 'activityCode'> {
  createdAtUtc: string;
  createdAtVietnam: string;
}

export interface ActivityTypeRetrieveResponse extends RetrieveAllResponse<ActivityTypeRetrieve> {}
