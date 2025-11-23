import type { RetrieveAllResponse } from '@/common/types/common.type';

// API Response Status Object
export interface StatusObject {
  key: number;
  name: string;
}

export interface TeacherInfo {
  id: string;
  name: string;
}

export interface VRLessonInfo {
  id: string;
  name: string;
}

// For Session List & Details Header
export interface VRLearningSession {
  id: string;
  className: string;
  startTimeAtUtc: string;
  endTimeAtUtc: string;
  durationInMinutes: number;
  status: StatusObject;
  vrLesson: VRLessonInfo;
  teacher: TeacherInfo;
  createdAtUtc: string;
  createdAtVietNam: string;
}

// Task info
export interface VRTaskInfo {
  vrTaskId: string;
  taskNumber: number;
  taskDescription: string;
}

// Detailed Student/Task Data
export interface VRDeviceTaskProgress {
  id: string;
  vrTask: VRTaskInfo;
  studentName: string;
  isCompleted: boolean;
  isCorrect: boolean;
  completionTimeAtUtc: string | null;
}

export interface VRDeviceInfo {
  vrDeviceId: string;
  deviceName: string;
}

export interface VRDeviceSessionSummary {
  id: string;
  vrDevice: VRDeviceInfo;
  vrLearningSessionId: string;
  studentName: string;
  noTasksCompleted: number;
}

// Complete Detail Response
export interface VRLearningSessionDetail extends VRLearningSession {
  vrDeviceTaskProgresses: VRDeviceTaskProgress[];
  vrDeviceSessionSummaries: VRDeviceSessionSummary[];
}

export interface VRLearningSessionRetrieveResponse extends RetrieveAllResponse<VRLearningSession> {}

// Params for listing
export interface SessionRetrieveParams {
  pageIndex: number;
  pageSize: number;
  isPaginated?: boolean;
  sortBy?: string;
  vrLearningSessionStatus?: number;
  className?: string;
  vrLessonId?: string;
  teacherId?: string;
}