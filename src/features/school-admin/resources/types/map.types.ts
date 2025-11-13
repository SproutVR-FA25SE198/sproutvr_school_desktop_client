import type { RetrieveAllResponse, Status } from "@/common/types/common.type";
import type { Subject } from "./subject.types";

export interface Map {
    id: string ,
    subject: SubjectRef,
    mapCode: string,
    name: string,
    description: string,
    status: Status, // 0 - Inactive, 1 - Active
    imageUrl: string,
    previewUrl: string,
    createdAtUtc: string,
    createdAtVietNam: string
}

export interface MapListItem extends Pick<Map, 'id' | 'name' | 'subject' | 'mapCode' | 'status' | 'imageUrl' | 'createdAtVietNam'> {}

export interface SubjectRef extends Pick<Subject, 'id' | 'name'> {}

export type MapList = RetrieveAllResponse<MapListItem>;