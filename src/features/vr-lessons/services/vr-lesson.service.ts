import type { VrLessonCreatePayload, VrLessonPatchPayload } from '@/common/types/vr-lesson.type';
import http from '@/common/utils/http';

export const createVrLessonPhaseOne = async (data: VrLessonCreatePayload) => {
  const result = await http.post('/api/v1/teacher/vrlessons', data);
  return result.data;
};

export const createVrLessonPhaseTwo = async ({
  lessonId,
  payload,
}: {
  lessonId: string;
  payload: VrLessonPatchPayload;
}) => {
  const result = await http.patch(`/api/v1/teacher/vrlessons/${lessonId}/design-preset`, payload);
  console.log('Patch Result:', result);
  return result.status;
};
