import type { BundlePayload, SeedMapBundlePayload } from '@/common/types/bundle.type';
import { http_provider, http_school } from '@/common/utils/http';

export const GET_BUNDLES_LIST_QUERY_KEY = 'GET_BUNDLES_LIST_QUERY_KEY';
export const GET_BUNDLE_DETAILS_QUERY__KEY = 'GET_BUNDLE_DETAILS_QUERY__KEY';

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
  const response = await http_provider.patch(`/bundle-payloads/items/${orderItemId}`, { organizationId });
  return response.data;
};

/**
 * Call the seed-bundle (import) API
 */
export const seedMapBundle = async (payload: SeedMapBundlePayload) => {
  const response = await http_school.post(
    '/v1/school-admin/maps/seed-bundle',
    payload,
  );
  return response.data;
};
