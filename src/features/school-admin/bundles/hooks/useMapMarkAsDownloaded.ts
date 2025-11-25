import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@/common/types/error.type';
import { GET_BUNDLES_LIST_QUERY_KEY, markMapAsDownloaded } from '../services/bundle.service';

interface MarkAsDownloadedParams {
  orderItemId: string;
  organizationId: string;
}

/**
 * Custom hook to mark a map as downloaded.
 */
export const useMarkMapAsDownloaded = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void, // Success data (No Content)
    AxiosError<ApiErrorResponse>, // Error type
    MarkAsDownloadedParams // Variables type
  >({
    mutationFn: (params: MarkAsDownloadedParams) => markMapAsDownloaded(params.orderItemId, params.organizationId),

    onSuccess: (_, variables) => {
      console.log('Successfully marked as downloaded.');
      // IMPORTANT: Invalidate the 'myBundles' query.
      // This tells React Query to re-fetch the bundle list,
      // which will now have the updated 'isDownloaded: true' flag.
      queryClient.invalidateQueries({ queryKey: [GET_BUNDLES_LIST_QUERY_KEY, variables.organizationId] });
    },
    onError: (error) => {
      console.error('Failed to mark as downloaded:', error.response?.data?.Message);
    },
  });
};
