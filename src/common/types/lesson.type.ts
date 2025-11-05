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
  vrLessonCount?: number;
}

export interface LessonGeneralRetrieve extends Pick<Lesson, 'id' | 'name' | 'description'> {}
