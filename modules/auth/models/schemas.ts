import { z } from 'zod';

// Schema para Login
export const loginSchema = z.object({
  email: z.string().min(1, 'Email es requerido').email('Email debe ser válido'),
  password: z
    .string()
    .min(1, 'Contraseña es requerida')
    .min(4, 'Contraseña debe tener al menos 4 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Nombre es requerido')
      .min(2, 'Nombre debe tener al menos 2 caracteres'),
    email: z
      .string()
      .min(1, 'Email es requerido')
      .email('Email debe ser válido'),
    password: z
      .string()
      .min(1, 'Contraseña es requerida')
      .min(4, 'Contraseña debe tener al menos 4 caracteres'),
    confirmPassword: z.string().min(1, 'Confirmar contraseña es requerido'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
