import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { KeyValidatePayload, KeyValidateResponse } from '@/common/types/bundle.type';
import type { AxiosError } from 'axios';
import { validateActivationKey } from '../services/key-validation.service';
import type { ApiErrorResponse } from '@/common/types/error.type';

/**
 * Custom hook to validate an activation key.
 *
 * This uses `useMutation` because validating a key is a one-time, user-triggered action
 */
const useValidateKey = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    KeyValidateResponse,     // Type of data returned on success
    AxiosError<ApiErrorResponse>, // Type of error returned from Axios
    KeyValidatePayload       // Type of data passed to the mutation function
  >({
    // Receives the 'payload' from the 'validateKey' function below.
    mutationFn: (payload: KeyValidatePayload) => validateActivationKey(payload),
    
    onSuccess: (data) => {
      // Invalidate the 'myBundles' list query
      // so it will be fresh if the user navigates back.
      queryClient.invalidateQueries({ queryKey: ['myBundles'] });
    },
    onError: (error) => {
      console.error('Validation failed:', error.response?.data.Message);
    }
  });

  return {
    
    // Call this async function to trigger the key validation.
    validateKey: mutation.mutateAsync,
    
    // The data returned from a successful validation.
    data: mutation.data,
    
    // True if the validation is currently in progress.
    isPending: mutation.isPending,
    
    // True if the last validation attempt resulted in an error.
    isError: mutation.isError,
    
    // The error object from the failed validation. You can check `error.response.data.Message` for the server's error string.
    error: mutation.error,
  };
};

export default useValidateKey;