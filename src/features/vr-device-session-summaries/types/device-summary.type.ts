export interface VRDeviceSessionSummaryDetail {
  vrDeviceId: string;
  vrLearningSessionId: string;
  studentName: string;
  noTasksCompleted: number;
  noTasksUncompleted: number;
  noCorrected: number;
  noInCorrected: number;
  totalTasks: number;
  vrDevice: {
    id: string;
    deviceName: string;
    serialNumber: string;
  };
  vrLearningSession: {
    id: string;
    className: string;
  };
  createdAtUtc: string;
  createdAtVietNam: string;
}