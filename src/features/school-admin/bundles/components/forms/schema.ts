import { z } from 'zod';

// Define the schema for the form data
export const activationSchema = z.object({
  activationKey: z
    .string()
    .min(1, 'Vui lòng nhập mã kích hoạt')
    .regex(/^([A-Z0-9]{5}-){4}[A-Z0-9]{5}$/, 'Mã kích hoạt không đúng định dạng'),
});

// Infer the TypeScript type from the schema
export type ActivationFormData = z.infer<typeof activationSchema>;