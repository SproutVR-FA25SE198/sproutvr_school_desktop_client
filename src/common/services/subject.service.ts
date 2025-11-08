import type { RetrieveAllResponse, Status } from '@/common/types/common.type';
import type { MasterSubject, Subject } from '@/common/types/subject.type';
import http from '@/common/utils/http';

export const GET_MASTER_SUBJECT_LIST_QUERY__KEY = 'GET_MASTER_SUBJECT_LIST_QUERY__KEY';
export const GET_SUBJECT_LIST_QUERY__KEY = 'GET_SUBJECT_LIST_QUERY__KEY';
export const SUBJECTS_STALE_TIME = 5 * 60 * 1000; // 5 minutes

export interface MasterSubjectRetrieve extends Pick<MasterSubject, 'id' | 'name' | 'description' | 'imageUrl'> {
  status: Status;
  createdAtUtc: string;
  createdAtVietnam: string;
}

export interface SubjectRetrieve extends Pick<Subject, 'id' | 'name' | 'description' | 'imageUrl'> {
  masterSubject: MasterSubjectRetrieve;
  status: Status;
  createdAtUtc: string;
  createdAtVietnam: string;
}

export interface SubjectRetrieveResponse extends RetrieveAllResponse<SubjectRetrieve> {}

export interface MasterSubjectRetrieveResponse extends RetrieveAllResponse<MasterSubjectRetrieve> {}

export const getMasterSubjectList = async () => {
  const result = await http.get<MasterSubjectRetrieveResponse>(`/api/v1/authorized/master-subjects?isPaginated=false`);
  return result.data;
};

export const getSubjectList = async () => {
  const result = await http.get<SubjectRetrieveResponse>(`/api/v1/authorized/subjects?isPaginated=false`);
  return result.data;
};
