import type { RetrieveAllResponse, Status } from "@/common/types/common.type"
import type { MasterSubject } from "./master-subject.types"

export interface Subject {
    id: string ,
    masterSubject : MasterSubjectRef,
    name: string ,
    description : string,
    imageUrl: string,
    status: Status, // 0 - Inactive, 1 - Active
    createdAtUtc: string,
    createdAtVietNam: string
}

export interface MasterSubjectRef extends Pick<MasterSubject, 'id' | 'name'> {}

export type SubjectList = RetrieveAllResponse<Subject>;