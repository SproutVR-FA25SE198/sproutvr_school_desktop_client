'use client';

import { http_school } from '@/common/utils/http';
import type { VRLesson, VRLessonList } from '../types/vr-lesson.types';

export interface FetchVRLessonsParams {
  pageIndex?: number;
  pageSize?: number;
  sortBy?: string;
  vrLessonStatus?: number; 
  lessonId?: string;
  mapId?: string;
  isPaginated?: boolean;
}

const DEFAULT_PARAMS: Required<Pick<FetchVRLessonsParams, 'pageIndex' | 'pageSize' | 'isPaginated' | 'sortBy'>> = {
  pageIndex: 1,
  pageSize: 10,
  isPaginated: true,
  sortBy: 'createdAtUtcDesc',
};

const VRLS_AUTHORIZED_ENDPOINT = '/api/v1/authorized/vrlessons';

export interface VRLessonListResult {
  items: VRLesson[];
  totalItems: number;
}

// Fetch VRLesson list
export async function fetchVRLessons(params: FetchVRLessonsParams = {}): Promise<VRLessonListResult> {
  const query = {
    ...DEFAULT_PARAMS,
    ...params,
  } as FetchVRLessonsParams;

  const response = await http_school.get<VRLessonList>(VRLS_AUTHORIZED_ENDPOINT, {
    params: query,
  });

  const apiData = response.data;

  if (!apiData?.items) {
    return { items: [], totalItems: 0 };
  }

  return {
    items: apiData.items,
    totalItems: apiData.totalItems ?? apiData.items.length,
  };
}

// Fetch VRLesson by id 
export async function fetchVRLessonById(id: string): Promise<VRLesson | null> {
  if (!id) return null;

  const response = await http_school.get<VRLesson>(`${VRLS_AUTHORIZED_ENDPOINT}/${id}`);
  const item = response.data;

  if (!item) {
    return null;
  }

  return item
}

// Change VRLesson status
export async function updateVRLessonStatus(id: string, status: number): Promise<void> {
  if (!id) throw new Error('Missing VRLesson id');

  await http_school.patch(`${VRLS_AUTHORIZED_ENDPOINT}/${id}/assign-status`, {
    status,
  });
}