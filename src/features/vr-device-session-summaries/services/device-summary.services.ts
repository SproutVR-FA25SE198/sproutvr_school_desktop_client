import { http_school } from "@/common/utils/http";
import type { VRDeviceSessionSummaryDetail } from "../types/device-summary.type";

export const getStudentDeviceSummary = async (sessionId: string, deviceId: string) => {
  const result = await http_school.get<VRDeviceSessionSummaryDetail>(
    `/api/v1/authorized/vr-device-session-summaries/${sessionId}/devices/${deviceId}`
  );
  return result.data;
};