export interface Subject {
  id: string;
  masterSubjectId: string;
  name: string;
  masterSubjectName: string;
  description: string;
  imageUrl: string;
  status: string;
}

export interface MasterSubject {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  status: string;
}
