import type { Lesson } from "./lesson.types";
import type { Map } from "./map.types";
import type { MasterSubject } from "./master-subject.types";
import type { Subject } from "./subject.types";
import type { VRLesson } from "./vr-lesson.types";

export interface MasterSubjectRef extends Pick<MasterSubject, 'id' | 'name'> {}

export interface SubjectRef extends Pick<Subject, 'id' | 'name'> {}

export interface MapRef extends Pick<Map, 'id' | 'name' | 'mapCode'> {}

export interface TeacherRef {
    id: string,
    firstName: string,
    lastName: string,
    name: string
}

export interface LessonRef extends Pick<Lesson, 'id' | 'name'> {}

export interface VRLessonRef extends Pick<VRLesson, 'id' | 'name'> {}
