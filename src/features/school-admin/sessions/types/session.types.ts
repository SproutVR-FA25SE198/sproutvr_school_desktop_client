import type { RetrieveAllResponse, Status } from "@/common/types/common.type";
import type { TeacherRef, VRLessonRef } from "../../resources/types/reference.types";

export interface Session {
    id: string,
    className: string,
    startTimeAtUtc: string,
    endTimeAtUtc: string,
    status: Status, // 0 - Completed, 1 - Cancelled
    durationInMinutes: number,
    vrLesson: VRLessonRef,
    teacher: TeacherRef,
    vrDeviceTaskProgresses: VRDeviceTaskProgress[],
    vrDeviceSessionSummaries: VRDeviceSessionSummary[],
    createdAtUtc: string,
    createdAtVietNam: string
}

export interface SessionListItem extends Pick<Session, 'id' | 'className' 
    | 'status' | 'vrLesson' | 'teacher' | 'createdAtUtc' | 'createdAtVietNam'> {}

export type SessionList = RetrieveAllResponse<Session>

export interface VRDeviceTaskProgress {
    id: string,
    vrDeviceId: string,
    vrTaskId: string,
    studentName: string,
    isCompleted: boolean,
    isCorrect: boolean,
    completionTimeAtUtc: string
}

export interface VRDeviceSessionSummary {
    id: string,
    studentName: string,
    noTasksCompleted: number
}