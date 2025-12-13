'use client';

import { http_school } from '@/common/utils/http';
import type { Lesson, LessonList, LessonListItem } from '../types/lesson.types';

export interface FetchLessonsParams {
  pageIndex?: number;
  pageSize?: number;
  sortBy?: string;
  lessonStatus?: number; 
  subjectId?: string;
  isPaginated?: boolean;
}

const DEFAULT_PARAMS: Required<Pick<FetchLessonsParams, 'pageIndex' | 'pageSize' | 'isPaginated' | 'sortBy'>> = {
  pageIndex: 1,
  pageSize: 10,
  isPaginated: true,
  sortBy: 'createdAtUtcDesc',
};

const LESSONS_AUTHORIZED_ENDPOINT = '/api/v1/authorized/lessons';

export interface LessonListResult {
  items: LessonListItem[];
  totalItems: number;
}

// Fetch Lesson list
export async function fetchLessons(params: FetchLessonsParams = {}): Promise<LessonListResult> {
  const query = {
    ...DEFAULT_PARAMS,
    ...params,
  } as FetchLessonsParams;

  const response = await http_school.get<LessonList>(LESSONS_AUTHORIZED_ENDPOINT, {
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

// Fetch Lesson by id 
export async function fetchLessonById(id: string): Promise<Lesson | null> {
  if (!id) return null;

  const response = await http_school.get<Lesson>(`${LESSONS_AUTHORIZED_ENDPOINT}/${id}`);
  const item = response.data;

  if (!item) {
    return null;
  }

  return item
}

// Change Lesson status
export async function updateLessonStatus(id: string, status: number): Promise<void> {
  if (!id) throw new Error('Missing Lesson id');

  await http_school.patch(`${LESSONS_AUTHORIZED_ENDPOINT}/${id}/assign-status`, {
    status,
  });
}