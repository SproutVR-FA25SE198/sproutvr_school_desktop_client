import type { RetrieveAllResponse, Status } from '@/common/types/common.type';
import type { Lesson } from '@/common/types/lesson.type';
import type { MasterSubject, Subject } from '@/common/types/subject.type';
import type { VrLessonRetrieve } from '@/common/types/vr-lesson.type';
import http from '@/common/utils/http';
import { toFormData } from 'axios';

export const GET_LESSON_LIST_QUERY__KEY = 'GET_LESSON_LIST_QUERY__KEY';

export const GET_LESSON_BY_ID_QUERY__KEY = 'GET_LESSON_BY_ID_QUERY__KEY';

export const GET_VR_LESSON_LIST_QUERY__KEY = 'GET_VR_LESSON_LIST_QUERY__KEY';

export const LESSONS_STALE_TIME = 5 * 60 * 1000; // 5 minutes

export type LessonRetrieveParams = {
  pageIndex: number;
  pageSize: number;
  sortBy: string;
  subjectId: string;
};

export interface LessonRetrieve
  extends Pick<Lesson, 'id' | 'name' | 'resourceRelativeFilePath' | 'description' | 'vrLessonsCount'> {
  status: Status;
  subject: Pick<Subject, 'id' | 'name' | 'description' | 'imageUrl'>;
  masterSubject: Pick<MasterSubject, 'name' | 'description' | 'imageUrl'>;
  teacher: {
    firstName: string;
    lastName: string;
  };
  createdAtUtc: string;
  createdAtVietnam: string;
}

export interface VrLessonRetrieveResponse extends RetrieveAllResponse<VrLessonRetrieve> {}

export interface LessonRetrieveResponse extends RetrieveAllResponse<LessonRetrieve> {}

export interface LessonCreationPayload {
  name: string;
  description: string;
  subjectId: string;
  teacherId?: string;
  resourceFile: File;
}

export const getLessonList = async (data: LessonRetrieveParams) => {
  const result = await http.get<LessonRetrieveResponse>(
    `/api/v1/authorized/lessons?pageIndex=${data.pageIndex}&pageSize=${data.pageSize}&isPaginated=false`,
  );
  return result.data;
};

export const getLessonById = async (lessonId: string) => {
  const result = await http.get<LessonRetrieve>(`/api/v1/authorized/lessons/${lessonId}`);
  return result.data;
};

export const createLesson = async (data: LessonCreationPayload) => {
  const result = await http.post(`/api/v1/teacher/lessons`, toFormData(data), {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return result.data;
};

export const getVrLessonList = async (lessonId: string) => {
  const result = await http.get<VrLessonRetrieveResponse>(`/api/v1/authorized/vrlessons?lessonId=${lessonId}`);
  return result.data;
};
