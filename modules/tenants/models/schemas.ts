/**
 * Zod validation schemas for tenant forms
 */

import { z } from "zod";

/**
 * Schema for updating tenant information
 */
export const updateTenantSchema = z.object({
  companyName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  companyEmail: z
    .string()
    .email("Ingrese un email válido")
    .max(100, "El email no puede exceder 100 caracteres"),
  companyPhone: z
    .string()
    .min(8, "El teléfono debe tener al menos 8 dígitos")
    .max(20, "El teléfono no puede exceder 20 caracteres")
    .regex(/^[0-9+\-\s()]+$/, "El teléfono solo puede contener números y símbolos válidos"),
  currentPlanId: z
    .string()
    .min(1, "Debe seleccionar un plan"),
});

export type UpdateTenantFormData = z.infer<typeof updateTenantSchema>;
