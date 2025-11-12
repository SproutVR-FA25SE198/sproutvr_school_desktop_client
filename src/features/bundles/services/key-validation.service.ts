import type { KeyValidatePayload } from '@/common/types/bundle.type';
import { http_provider } from '@/common/utils/http';

/**
 * Sends the activation key to the server for validation.
 */
export const validateActivationKey = async (data: KeyValidatePayload) => {
  const result = await http_provider.post('/keys/validate', data);
  return result.data;
};
