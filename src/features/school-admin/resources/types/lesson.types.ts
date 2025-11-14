import type { RetrieveAllResponse, Status } from "@/common/types/common.type"
import type { MasterSubjectRef, SubjectRef, TeacherRef } from "./reference.types"

export interface Lesson extends Pick<LessonListItem, 
    'id' 
    | 'subject' 
    | 'teacher' 
    | 'name' 
    | 'description' 
    | 'resourceRelativeFilePath'
    | 'status' 
    | 'createdAtUtc' 
    | 'createdAtVietNam'
> {}

export interface LessonListItem {
    id: string,
    subject: SubjectRef,
    masterSubject: MasterSubjectRef,
    teacher: TeacherRef,
    name: string,
    description: string,
    resourceRelativeFilePath: string,
    vrLessonsCount: number,
    status: Status,
    createdAtUtc: string,
    createdAtVietNam: string
}

export type LessonList = RetrieveAllResponse<LessonListItem>;