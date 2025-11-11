import type { Status } from './common.type';
import type { LessonGeneralRetrieve } from './lesson.type';
import type { ActivityType, MapGeneralRetrieve, MapObject, TaskLocation } from './map.type';

export interface VrLesson {
  id: string;
  name?: string;
  mapId: string;
  lessonId: string;
  mapName: string;
  lessonName: string;
  description: string;
  maxDuration: number;
  presetJsonRelativeFilePath: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface VrTask {
  id: string;
  vrLessonId: string;
  taskLocationId: string;
  taskLocationName: string;
  mapObjectId: string;
  mapObjectName: string;
  activityTypeId: string;
  activityTypeName: string;
  taskNumber: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface VrTaskCreatePayload {
  description: string;
  taskLocationId: string;
  mapObjectId: string;
  activityTypeId: string;
  taskNumber: number;
}

export interface VrTaskRetrieve extends Pick<VrTask, 'id' | 'taskNumber' | 'description'> {
  taskLocation: TaskLocation;
  mapObject: MapObject;
  activityType: ActivityType;
}

export interface VrLessonCreatePayload {
  mapId: string;
  lessonId: string;
  description: string;
  maxDuration: string;
  name: string;
  tasks: VrTaskCreatePayload[];
}

export interface VrTaskAnswer {
  text: string;
  isCorrect: boolean;
}

export interface VrTaskDetails {
  vrTaskId: string;
  question: string;
  answers: VrTaskAnswer[];
  information: string;
}

export interface VrLessonRetrieve {
  id: string;
  lesson: LessonGeneralRetrieve;
  map: MapGeneralRetrieve;
  name: string;
  description: string;
  duration: string; // format: "HH:mm:ss"
  presetJsonRelativeFilePath: string;
  status: Status;
  tasks: VrTaskRetrieve[];
  createdAtUtc: string;
  createdAtVietnam: string;
}

export interface VrLessonStatus {
  key: string;
  name: string;
}

export interface VrLessonPatchPayload {
  isSequential?: boolean;
  taskConfigs: VrTaskDetails[];
}
