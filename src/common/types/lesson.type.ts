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
}

export interface LessonGeneralRetrieve extends Pick<Lesson, 'id' | 'name' | 'description'> {}
