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

export interface MapGeneralRetrieve extends Pick<Map, 'id' | 'name' | 'mapCode'> {}

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
