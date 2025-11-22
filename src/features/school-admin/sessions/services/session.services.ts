'use client';

import { http_school } from '@/common/utils/http';
import type { Session, SessionList, SessionListItem } from '../types/session.types';

export interface FetchSessionsParams {
  pageIndex?: number;
  pageSize?: number;
  sortBy?: string;
  vrLearningSessionStatus?: number; 
  vrLessonId?: string;
  teacherId?: string;
  isPaginated?: boolean;
}

const DEFAULT_PARAMS: Required<Pick<FetchSessionsParams, 'pageIndex' | 'pageSize' | 'isPaginated' | 'sortBy'>> = {
  pageIndex: 1,
  pageSize: 10,
  isPaginated: true,
  sortBy: 'createdAtUtcDesc',
};

const SESSION_AUTHORIZED_ENDPOINT = '/api/v1/authorized/vr-learning-sessions';

export interface SessionListResult {
  items: SessionListItem[];
  totalItems: number;
}

// Fetch Session list
export async function fetchSessions(params: FetchSessionsParams = {}): Promise<SessionListResult> {
  const query = {
    ...DEFAULT_PARAMS,
    ...params,
  } as FetchSessionsParams;

  const response = await http_school.get<SessionList>(SESSION_AUTHORIZED_ENDPOINT, {
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

// Fetch Session by id 
export async function fetchSessionById(id: string): Promise<Session | null> {
  if (!id) return null;

  const response = await http_school.get<Session>(`${SESSION_AUTHORIZED_ENDPOINT}/${id}`);
  const item = response.data;

  if (!item) {
    return null;
  }

  return item
}