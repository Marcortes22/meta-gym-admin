import { z } from 'zod';

export const approveRequestSchema = z.object({
  adminEmail: z
    .string()
    .min(1, 'Email is required')
    .email('Must be a valid email'),
  adminPassword: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password is too long'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm password'),
}).refine((data) => data.adminPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type ApproveRequestFormData = z.infer<typeof approveRequestSchema>;


export const rejectRequestSchema = z.object({
  rejectionReason: z
    .string()
    .min(10, 'Reason must be at least 10 characters')
    .max(500, 'Reason is too long'),
});

export type RejectRequestFormData = z.infer<typeof rejectRequestSchema>;
