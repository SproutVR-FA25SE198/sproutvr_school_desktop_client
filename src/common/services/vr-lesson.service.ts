import type { RetrieveAllResponse } from '../types/common.type';
import type { VrLessonRetrieve } from '../types/vr-lesson.type';
import http from '../utils/http';

export const GET_VR_LESSON_BY_ID_QUERY_KEY = 'GET_VR_LESSON_BY_ID_QUERY_KEY';
export const GET_ALL_VR_LESSONS_QUERY_KEY = 'GET_ALL_VR_LESSONS_QUERY_KEY';

export const getVrLessonById = async (lessonId: string) => {
  const result = await http.get<VrLessonRetrieve>(`/api/v1/authorized/vrlessons/${lessonId}`);
  return result.data;
};

export const getAllVrLessons = async () => {
  const result = await http.get<RetrieveAllResponse<VrLessonRetrieve>>(
    `/api/v1/authorized/vrlessons?isPaginated=false`,
  );
  return result.data;
};
