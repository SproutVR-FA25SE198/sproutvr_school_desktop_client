import { useQuery } from '@tanstack/react-query';
import {
  GET_MASTER_SUBJECT_LIST_QUERY__KEY,
  getMasterSubjectList,
  SUBJECTS_STALE_TIME,
} from '../services/subject.service';

const useGetMasterSubjects = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [GET_MASTER_SUBJECT_LIST_QUERY__KEY],
    queryFn: async () => await getMasterSubjectList(),
    staleTime: SUBJECTS_STALE_TIME,
    refetchOnWindowFocus: false,
  });

  return { data, isLoading, isError };
};

export default useGetMasterSubjects;
