import type { RetrieveAllResponse, Status } from "@/common/types/common.type"
import type { LessonRef, MapRef } from "./reference.types"

export interface VRLesson {
    id: string,
    lesson: LessonRef,
    map: MapRef,
    name: string,
    description: string,
    maxDuration: string,
    duration: string,
    presetJsonRelativeFilePath: string,
    status: Status,
    createdAtUtc: string,
    createdAtVietNam: string
    //tasks: VRTaskRef[]
}

export type VRLessonList = RetrieveAllResponse<VRLesson>