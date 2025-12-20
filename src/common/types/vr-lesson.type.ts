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
  question?: string;
  mapObject: MapObject;
  taskDescription?: string;
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
  maxDuration: string; // format: "HH:mm:ss"
  duration?: string;
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

export interface VrLessonPresetTask {
  locationCode: string;
  vrTaskId: string;
  taskNumber: number;
  taskDescription: string;
  mapObject: {
    objectCode: string;
    activityType: {
      activityCode: string;
      config?: {
        information?: string;
        question?: string;
        answers?: VrTaskAnswer[];
      };
    };
  };
}

export interface VrLessonPreset {
  mapCode: string;
  duration: number;
  isSequential: boolean;
  vrTasks: VrLessonPresetTask[];
}

export interface VrLessonPresetTaskExtended extends VrLessonPresetTask {
  locationName: string;
  locationImageUrl: string;
  mapObject: VrLessonPresetTask['mapObject'] & {
    name: string;
    imageUrl: string;
    activityType: VrLessonPresetTask['mapObject']['activityType'] & {
      name: string;
    };
  };
}

export interface VrLessonPresetExtended extends VrLessonPreset {
  vrTasks: VrLessonPresetTaskExtended[];
}
