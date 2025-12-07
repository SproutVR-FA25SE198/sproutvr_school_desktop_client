'use client';

import { http_school } from '@/common/utils/http';
import type { MasterSubject, MasterSubjectList } from '../types/master-subject.types';

export interface FetchMasterSubjectsParams {
  pageIndex?: number;
  pageSize?: number;
  sortBy?: string;
  masterSubjectStatus?: number; 
  isPaginated?: boolean;
}

const DEFAULT_PARAMS: Required<Pick<FetchMasterSubjectsParams, 'pageIndex' | 'pageSize' | 'isPaginated' | 'sortBy'>> = {
  pageIndex: 1,
  pageSize: 10,
  isPaginated: true,
  sortBy: 'createdAtUtcDesc',
};

const MS_ADMIN_ENDPOINT = '/api/v1/school-admin/master-subjects';
const MS_AUTHORIZED_ENDPOINT = '/api/v1/authorized/master-subjects';

export interface MasterSubjectListResult {
  items: MasterSubject[];
  totalItems: number;
}

// Fetch MasterSubject list
export async function fetchMasterSubjects(params: FetchMasterSubjectsParams = {}): Promise<MasterSubjectListResult> {
  const query = {
    ...DEFAULT_PARAMS,
    ...params,
  } as FetchMasterSubjectsParams;

  const response = await http_school.get<MasterSubjectList>(MS_AUTHORIZED_ENDPOINT, {
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

// Fetch MasterSubject by id 
export async function fetchMasterSubjectById(id: string): Promise<MasterSubject | null> {
  if (!id) return null;

  const response = await http_school.get<MasterSubject>(`${MS_AUTHORIZED_ENDPOINT}/${id}`);
  const item = response.data;

  if (!item) {
    return null;
  }

  return item
}

// Change MasterSubject status
export async function updateMasterSubjectStatus(id: string, status: number): Promise<void> {
  if (!id) throw new Error('Missing MasterSubject id');

  await http_school.patch(`${MS_ADMIN_ENDPOINT}/${id}/assign-status`, {
    status,
  });
}