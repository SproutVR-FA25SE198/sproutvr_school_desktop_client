import type { BundlePayload } from '@/common/types/bundle.type';
import { http_provider } from '@/common/utils/http';

/**
 * Fetch all bundles for an organization.
 */
export const getMyBundles = async (organizationId: string): Promise<BundlePayload[]> => {
  const response = await http_provider.post('/bundle-payloads', { organizationId });
  return response.data;
};

/**
 * Get bundle by order ID.
 */
export const getBundleDetails = async (orderId:string, organizationId: string): Promise<BundlePayload> => {
  const response = await http_provider.post(`/bundle-payloads/${orderId}`, { organizationId });
  return response.data;
};

/**
 * Marked a map as downloaded
 */
export const markMapAsDownloaded = async (orderItemId: string, organizationId: string) => {
  const response = await http_provider.patch(`/bundle-payloads/${orderItemId}`, { organizationId });
  return response.data;
};
