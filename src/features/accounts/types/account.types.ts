import type { Status, RetrieveAllResponse } from '@/common/types/common.type';

export enum AccountStatus {
  Active = 1,
  Disabled = 0
}

export interface Account {
  userId: string;
  email: string;
  fullName: string;
  dateOfBirth: string | null;
  status: AccountStatus; 
  createdAtUtc: string;
  createdAtVietNam: string;
}

export interface AccountDetail {
  teacherId: string;
  email: string;
  fullName: string;
  status: Status; 
  dateOfBirth: string | null;
  joinedAtUtc: string;
  lessons: AccountDetailLesson[];
  vrLearningSessions: AccountDetailSessionResponse[]; 
}

export enum AccountDetailLessonStatus {
    Active = 1,
    Inactive = 0
}

export interface AccountDetailLesson {
    lessonId: string,
    name: string,
    status: AccountDetailLessonStatus
}

// Teacher account item in account list from json response
export interface AccountResponse {
  userId: string;
  email: string;
  fullName: string;
  status: string;
  dateOfBirth: string | null;
  createdAtUtc: string;
  createdAtVietNam: string;
}

// Teacher accounts list from json response
export type AccountListResponse = RetrieveAllResponse<AccountResponse>;

export interface AccountDetailLessonResponse {
    lessonId: string,
    name: string,
    status: string
}

export interface AccountDetailSessionResponse {
  sessionId: string,
  className: string,
  createdAtUtc: string
}

// Teacher account detail from json response
export interface AccountDetailResponse {
  teacherId: string;
  email: string;
  fullName: string;
  status: Status; 
  roles: string[];
  dateOfBirth: string | null;
  joinedAtUtc: string;
  lessons: AccountDetailLessonResponse[];
  vrLearningSessions: AccountDetailSessionResponse[]; 
}

// Helper functions for status display
export const getStatusLabel = (status: AccountStatus): string => {
  switch (status) {
    case AccountStatus.Active:
      return "Hoạt động"
    case AccountStatus.Disabled: 
      return "Đã khóa"
    default: 
      return "Không xác định"
  }
}

export const getStatusVariant = (status: AccountStatus): "success" | "error" | "warning" => {
  switch (status) {
    case AccountStatus.Active:
      return "success"
    case AccountStatus.Disabled:
      return "warning"
    default:
      return "error"
  }
}

export const getStatusColor = (status: AccountStatus): string => {
  switch (status) {
    case AccountStatus.Active:
      return "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
    case AccountStatus.Disabled:
      return "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200"
    default:
      return "bg-white"
  }
}