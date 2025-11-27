import { z } from 'zod';

export const lessonCreationSchema = z.object({
  name: z.string().min(1, 'Hãy nhập tên bài giảng').max(100, 'Tên bài giảng phải ít hơn 100 ký tự'),
  description: z.string().min(1, 'Hãy nhập mô tả bài giảng').max(1000, 'Mô tả bài giảng phải ít hơn 1000 ký tự'),
  subjectId: z.string().min(1, 'Hãy chọn môn học'),
  classId: z.string().min(1, 'Hãy chọn lớp học'),
  resourceFile: z
    .instanceof(File, { message: 'Tài liệu bài giảng là bắt buộc' })
    .refine((file) => file.type === 'application/pdf', {
      message: 'Tài liệu phải là file PDF',
    })
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: 'Kích thước file phải nhỏ hơn 10MB',
    }),
});

export type LessonFormData = z.infer<typeof lessonCreationSchema>;
