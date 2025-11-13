'use client';

import { http_school } from '@/common/utils/http';
import type { Subject, SubjectList } from '../types/subject.types';

export interface FetchSubjectsParams {
  pageIndex?: number;
  pageSize?: number;
  sortBy?: string;
  subjectStatus?: number; 
  masterSubjectId?: string;
  isPaginated?: boolean;
}

const DEFAULT_PARAMS: Required<Pick<FetchSubjectsParams, 'pageIndex' | 'pageSize' | 'isPaginated' | 'sortBy'>> = {
  pageIndex: 1,
  pageSize: 10,
  isPaginated: true,
  sortBy: 'createdAtUtcDesc',
};

const SUBJECTS_ADMIN_ENDPOINT = '/v1/school-admin/subjects';
const SUBJECTS_AUTHORIZED_ENDPOINT = '/v1/authorized/subjects';

export interface SubjectListResult {
  items: Subject[];
  totalItems: number;
}

// Fetch Subject list
export async function fetchSubjects(params: FetchSubjectsParams = {}): Promise<SubjectListResult> {
  const query = {
    ...DEFAULT_PARAMS,
    ...params,
  } as FetchSubjectsParams;

  const response = await http_school.get<SubjectList>(SUBJECTS_AUTHORIZED_ENDPOINT, {
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

// Fetch Subject by id 
export async function fetchSubjectById(id: string): Promise<Subject | null> {
  if (!id) return null;

  const response = await http_school.get<Subject>(`${SUBJECTS_AUTHORIZED_ENDPOINT}/${id}`);
  const item = response.data;

  if (!item) {
    return null;
  }

  return item
}

// Change Subject status
export async function updateSubjectStatus(id: string, status: number): Promise<void> {
  if (!id) throw new Error('Missing Subject id');

  await http_school.patch(`${SUBJECTS_ADMIN_ENDPOINT}/${id}/assign-status`, {
    status,
  });
}