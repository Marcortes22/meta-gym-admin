
import { z } from "zod";


export const updateTenantSchema = z.object({
  companyName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  companyEmail: z
    .string()
    .email("Enter a valid email")
    .max(100, "Email cannot exceed 100 characters"),
  companyPhone: z
    .string()
    .min(8, "Phone must be at least 8 digits")
    .max(20, "Phone cannot exceed 20 characters")
    .regex(/^[0-9+\-\s()]+$/, "Phone can only contain numbers and valid symbols"),
  currentPlanId: z
    .string()
    .min(1, "Must select a plan"),
});

export type UpdateTenantFormData = z.infer<typeof updateTenantSchema>;
