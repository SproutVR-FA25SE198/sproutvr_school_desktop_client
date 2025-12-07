import type { SeedMapBundlePayload } from '@/features/school-admin/bundles/types/bundle.type';
import { useMutation } from '@tanstack/react-query';
import { seedMapBundle } from '../services/bundle.service';

export const useSeedMapBundle = () => {
  return useMutation({
    mutationFn: (payload: SeedMapBundlePayload) => seedMapBundle(payload),
    onSuccess: () => {
        console.log("Seed map successfully");
    },
    onError: (error: any) => {
      console.log(error?.response?.data?.detail)
    },
  });
};