import type { RetrieveAllResponse, Status } from "@/common/types/common.type";

export interface MasterSubject {
    id: string,
    name: string,
    description: string,
    imageUrl: string,
    status: Status, // 0 - Inactive, 1 - Active
    createdAtUtc: string,
    createdAtVietNam: string
}

export type MasterSubjectList = RetrieveAllResponse<MasterSubject>;