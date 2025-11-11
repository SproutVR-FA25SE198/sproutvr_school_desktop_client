import { useQuery } from '@tanstack/react-query';
import type { BundlePayload } from '@/common/types/bundle.type';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@/common/types/error.type';
import { getBundleDetails } from '../services/bundle.service';

/**
 * Custom hook to fetch details for one specific bundle.
 */
export const useGetBundleDetails = (
  orderId: string,
  organizationId: string,
) => {
  return useQuery<
    BundlePayload, // Success data
    AxiosError<ApiErrorResponse> // Error type
  >({
    // This query is unique to this specific orderId
    queryKey: ['bundleDetails', orderId],
    
    queryFn: () => getBundleDetails(orderId, organizationId),
    
    // Only run this query if we have both IDs
    enabled: !!orderId && !!organizationId,
    
    refetchOnWindowFocus: false,
  });
};