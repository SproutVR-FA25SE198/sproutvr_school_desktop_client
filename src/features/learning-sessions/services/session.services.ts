import http from '@/common/utils/http';
import type { SessionRetrieveParams, VRLearningSessionDetail, VRLearningSessionRetrieveResponse } from '../types/session-manage.type';


export const GET_SESSION_LIST_QUERY_KEY = 'GET_SESSION_LIST_QUERY_KEY';
export const GET_SESSION_DETAIL_QUERY_KEY = 'GET_SESSION_DETAIL_QUERY_KEY';

export const SESSIONS_STALE_TIME = 5 * 60 * 1000; // 5 mins

export const getSessionList = async (params: SessionRetrieveParams) => {
  // Build query string manually
  const queryParams = new URLSearchParams({
    pageIndex: params.pageIndex.toString(),
    pageSize: params.pageSize.toString(),
    isPaginated: (params.isPaginated ?? true).toString(),
    ...(params.sortBy && { sortBy: params.sortBy }),
    ...(params.className && { className: params.className }),
  });

  const result = await http.get<VRLearningSessionRetrieveResponse>(
    `/api/v1/authorized/vr-learning-sessions?${queryParams.toString()}`
  );
  return result.data;
};

export const getSessionById = async (id: string) => {
  const result = await http.get<VRLearningSessionDetail>(
    `/api/v1/authorized/vr-learning-sessions/${id}`
  );
  return result.data;
};