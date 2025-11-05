import type { VrLessonCreatePayload } from '@/common/types/vr-lesson.type';
import http from '@/common/utils/http';

export const CreateVrLessonPhaseOne = async (data: VrLessonCreatePayload) => {
  const result = await http.post('/v1/teacher/vrlessons', data);
  return result.data;
};
