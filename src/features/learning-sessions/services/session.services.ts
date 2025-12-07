import { http_school } from '@/common/utils/http';
import type { SessionRetrieveParams, VRLearningSessionDetail, VRLearningSessionRetrieveResponse } from '../types/session-manage.type';


export const GET_SESSION_LIST_QUERY_KEY = 'GET_SESSION_LIST_QUERY_KEY';
export const GET_SESSION_DETAIL_QUERY_KEY = 'GET_SESSION_DETAIL_QUERY_KEY';

export const SESSIONS_STALE_TIME = 5 * 60 * 1000; // 5 mins

export const getSessionList = async (params: SessionRetrieveParams) => {
  // Create a clean object for URLSearchParams
  const searchParams = new URLSearchParams();

  // Always present params
  searchParams.append('pageIndex', params.pageIndex.toString());
  searchParams.append('pageSize', params.pageSize.toString());
  searchParams.append('isPaginated', (params.isPaginated ?? true).toString());

  if (params.sortBy) {
    searchParams.append('sortBy', params.sortBy);
  }

  if (params.className) {
    searchParams.append('className', params.className);
  }

  if (params.vrLearningSessionStatus !== undefined && params.vrLearningSessionStatus !== null) {
    searchParams.append('vrLearningSessionStatus', params.vrLearningSessionStatus.toString());
  }

  if (params.teacherId) {
    searchParams.append('teacherId', params.teacherId);
  }

  const result = await http_school.get<VRLearningSessionRetrieveResponse>(
    `/api/v1/authorized/vr-learning-sessions?${searchParams.toString()}`
  );
  
  return result.data;
}

export const getSessionById = async (id: string) => {
  const result = await http_school.get<VRLearningSessionDetail>(
    `/api/v1/authorized/vr-learning-sessions/${id}`
  );
  return result.data;
};