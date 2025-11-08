import { GET_SUBJECT_LIST_QUERY__KEY, getSubjectList, SUBJECTS_STALE_TIME } from '../services/subject.service';
import { useQuery } from '@tanstack/react-query';

const useGetSubjects = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [GET_SUBJECT_LIST_QUERY__KEY],
    queryFn: async () => await getSubjectList(),
    staleTime: SUBJECTS_STALE_TIME,
    refetchOnWindowFocus: false,
  });

  return { data, isLoading, isError };
};

export default useGetSubjects;
