import { z } from 'zod';

/**
 * Schema de validación para aprobar una solicitud
 */
export const approveRequestSchema = z.object({
  adminEmail: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('Debe ser un correo electrónico válido'),
  adminPassword: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(100, 'La contraseña es demasiado larga'),
  confirmPassword: z
    .string()
    .min(1, 'Por favor confirme la contraseña'),
}).refine((data) => data.adminPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export type ApproveRequestFormData = z.infer<typeof approveRequestSchema>;

/**
 * Schema de validación para rechazar una solicitud
 */
export const rejectRequestSchema = z.object({
  rejectionReason: z
    .string()
    .min(10, 'La razón debe tener al menos 10 caracteres')
    .max(500, 'La razón es demasiado larga'),
});

export type RejectRequestFormData = z.infer<typeof rejectRequestSchema>;
