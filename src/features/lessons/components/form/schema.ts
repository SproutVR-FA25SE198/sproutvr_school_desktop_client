import { z } from 'zod';

export const lessonCreationSchema = z.object({
  name: z.string().min(1, 'Lesson name is required').max(100, 'Lesson name must be 100 characters or less'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be 1000 characters or less'),
  subjectId: z.string().min(1, 'Subject is required'),
  resourceFile: z
    .instanceof(File, { message: 'Resource file is required' })
    .refine((file) => file.type === 'application/pdf', {
      message: 'File must be a PDF',
    })
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: 'File size must be less than 10MB',
    }),
});

export type LessonCreationPayload = z.infer<typeof lessonCreationSchema>;
