import { useQuery } from '@tanstack/react-query';
import type { BundlePayload } from '@/features/school-admin/bundles/types/bundle.type';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@/common/types/error.type';
import { getMyBundles } from '../services/bundle.service';

/**
 * Custom hook to fetch all activated bundles for a user.
 */
export const useGetMyBundles = (organizationId: string) => {
  return useQuery<
    BundlePayload[], // Success data
    AxiosError<ApiErrorResponse> // Error type
  >({
    // The query key ensures this data is refetched if the orgId changes
    // and is used for caching.
    queryKey: ['myBundles', organizationId],
    
    queryFn: () => getMyBundles(organizationId),
    
    // Don't refetch automatically when the window is focused
    refetchOnWindowFocus: false,
    
    // Only run this query if the organizationId is provided
    enabled: !!organizationId,
  });
};