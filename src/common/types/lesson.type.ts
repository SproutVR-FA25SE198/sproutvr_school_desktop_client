import type { Status } from './common.type';
import type { MasterSubject, Subject } from './subject.type';

export interface Lesson {
  id: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  name: string;
  description: string;
  resourceRelativeFilePath: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  subjectImage?: string;
  vrLessonsCount?: number;
}

export interface LessonGeneralRetrieve extends Pick<Lesson, 'id' | 'name' | 'description'> {}

export interface LessonRetrieve
  extends Pick<Lesson, 'id' | 'name' | 'resourceRelativeFilePath' | 'description' | 'vrLessonsCount'> {
  status: Status;
  subject: Pick<Subject, 'id' | 'name' | 'description' | 'imageUrl'>;
  masterSubject: Pick<MasterSubject, 'name' | 'description' | 'imageUrl'>;
  teacher: {
    firstName: string;
    lastName: string;
  };
  createdAtUtc: string;
  createdAtVietnam: string;
}
