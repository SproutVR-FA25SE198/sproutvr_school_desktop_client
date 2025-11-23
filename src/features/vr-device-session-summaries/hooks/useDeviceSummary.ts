import { useQuery } from "@tanstack/react-query";
import { getStudentDeviceSummary } from "../services/device-summary.services";

export const GET_DEVICE_SUMMARY_QUERY_KEY = 'GET_DEVICE_SUMMARY_QUERY_KEY';

export const useGetStudentDeviceSummary = (sessionId: string, deviceId: string) => {
  return useQuery({
    queryKey: [GET_DEVICE_SUMMARY_QUERY_KEY, sessionId, deviceId],
    queryFn: () => getStudentDeviceSummary(sessionId, deviceId),
    enabled: !!sessionId && !!deviceId,
  });
}