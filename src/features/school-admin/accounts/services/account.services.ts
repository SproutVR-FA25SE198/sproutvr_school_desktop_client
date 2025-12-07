'use client';

import { http_school } from '@/common/utils/http';
import {
  type Account,
  type AccountDetail,
  type AccountListResponse,
  type AccountDetailResponse,
  AccountStatus,
  AccountDetailLessonStatus,
} from '../types/account.types';

export interface FetchAccountsParams {
  role?: string,
  pageIndex?: number;
  pageSize?: number;
  sortBy?: string;
  status?: AccountStatus; // 0 or 1
  isPaginated?: boolean;
}

const DEFAULT_PARAMS: Required<Pick<FetchAccountsParams, 'role' | 'pageIndex' | 'pageSize' | 'isPaginated' | 'sortBy'>> = {
  role: 'Teacher',
  pageIndex: 1,
  pageSize: 10,
  isPaginated: true,
  sortBy: 'createdAtUtcDesc',
};

const ACCOUNTS_ADMIN_ENDPOINT = '/api/v1/school-admin/accounts';
const ACCOUNT_AUTHORIZED_ENDPOINT = '/api/v1/authorized/accounts';

export interface AccountListResult {
  items: Account[];
  totalItems: number;
}

// Fetch teacher account list
export async function fetchAccounts(params: FetchAccountsParams = {}): Promise<AccountListResult> {
  const query = {
    ...DEFAULT_PARAMS,
    ...params,
  } as FetchAccountsParams;

  const response = await http_school.get<AccountListResponse>(ACCOUNT_AUTHORIZED_ENDPOINT, {
    params: query,
  });

  const apiData = response.data;

  if (!apiData?.items) {
    return { items: [], totalItems: 0 };
  }

  // Map to Account type
  const cleanItems: Account[] = apiData.items.map((item) => ({
    userId: item.userId,
    email: item.email,
    fullName: item.fullName,
    dateOfBirth: item.dateOfBirth,
    status: item.status.toLowerCase() === 'active' ? AccountStatus.Active : AccountStatus.Disabled,
    createdAtUtc: item.createdAtUtc,
    createdAtVietNam: item.createdAtVietNam,
  }));

  return {
    items: cleanItems,
    totalItems: apiData.totalItems ?? apiData.items.length,
  };
}

// Fetch teacher account by id 
export async function fetchAccountById(id: string): Promise<AccountDetail | null> {
  if (!id) return null;

  const response = await http_school.get<AccountDetailResponse>(`${ACCOUNT_AUTHORIZED_ENDPOINT}/${id}`);
  const item = response.data;

  if (!item) {
    return null;
  }

  // Map return of type AccountDetail
  return {
    teacherId: item.teacherId,
    email: item.email,
    fullName: item.fullName,
    status: item.status,
    dateOfBirth: item.dateOfBirth,
    joinedAtUtc: item.joinedAtUtc,
    lessons: item.lessons.map((lesson) => ({
      lessonId: lesson.lessonId,
      name: lesson.name,
      status:
        lesson.status.toLowerCase() === 'active'
          ? AccountDetailLessonStatus.Active
          : AccountDetailLessonStatus.Inactive,
    })),
    vrLearningSessions: item.vrLearningSessions,
  };
}

// Send file for account import
export async function importAccounts(file: File): Promise<void> {
  const formData = new FormData();
  formData.append('excelFile', file);

  await http_school.post(`${ACCOUNTS_ADMIN_ENDPOINT}/import`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

// Deactivate/reactivate account status
export async function updateAccountStatus(id: string, status: AccountStatus): Promise<void> {
  if (!id) throw new Error('Missing account id');

  await http_school.patch(`${ACCOUNTS_ADMIN_ENDPOINT}/${id}/assign-status`, {
    status, // Sends { status: 0 } or { status: 1 }
  });
}