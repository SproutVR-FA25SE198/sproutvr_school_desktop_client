import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Xin hãy nhập email')
    .max(100, 'Email không được vượt quá 100 ký tự')
    .email('Email không hợp lệ'),

  password: z.string().min(1, 'Xin hãy nhập mật khẩu').max(50, 'Mật khẩu quá dài'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
