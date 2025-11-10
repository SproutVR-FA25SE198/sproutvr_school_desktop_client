import type { KeyValidatePayload } from '@/common/types/bundle.type';
import http from '@/common/utils/http';

/**
 * Sends the activation key to the server for validation.
 */
export const ValidateActivationKey = async (data: KeyValidatePayload) => {
  const result = await http.post('/keys/validate', data);
  return result.data;
};
