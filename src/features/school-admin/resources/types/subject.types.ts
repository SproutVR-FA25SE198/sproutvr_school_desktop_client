import type { RetrieveAllResponse, Status } from "@/common/types/common.type"
import type { MasterSubjectRef } from "./reference.types";

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

export type SubjectList = RetrieveAllResponse<Subject>;