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


// Schema for new password if user is changing password
export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
    newPassword: z
      .string()
      .min(8, 'Tối thiểu 8 ký tự')
      .regex(/[A-Z]/, 'Cần ít nhất 1 chữ hoa')
      .regex(/[a-z]/, 'Cần ít nhất 1 chữ thường')
      .regex(/[0-9]/, 'Cần ít nhất 1 số')
      .regex(/^[a-zA-Z0-9]+$/, 'Không được chứa ký tự đặc biệt'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

export type PasswordFormData = z.infer<typeof passwordSchema>;
