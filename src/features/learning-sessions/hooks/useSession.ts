import { useQuery } from '@tanstack/react-query';
import type { SessionRetrieveParams } from '../types/session-manage.type';
import { GET_SESSION_DETAIL_QUERY_KEY, GET_SESSION_LIST_QUERY_KEY, getSessionById, getSessionList, SESSIONS_STALE_TIME } from '../services/session.services';


export const useGetSessions = (params: SessionRetrieveParams) => {
  return useQuery({
    queryKey: [GET_SESSION_LIST_QUERY_KEY, params],
    queryFn: () => getSessionList(params),
    staleTime: SESSIONS_STALE_TIME,
    refetchOnWindowFocus: false,
  });
};

export const useGetSessionDetail = (sessionId: string) => {
  return useQuery({
    queryKey: [GET_SESSION_DETAIL_QUERY_KEY, sessionId],
    queryFn: () => getSessionById(sessionId),
    enabled: !!sessionId, // Only run if ID exists
    staleTime: SESSIONS_STALE_TIME,
  });
};