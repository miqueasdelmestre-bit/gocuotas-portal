import { z } from "zod";

import { isValidCuit } from "@/lib/validators";

export const commercialConditionRequestSchema = z.object({
  cuit: z
    .string()
    .min(1, "Ingresá tu CUIT")
    .refine(isValidCuit, "El CUIT ingresado no es válido"),
  email: z
    .string()
    .min(1, "Ingresá tu correo electrónico")
    .email("Ingresá un correo electrónico válido"),
  acceptsCommercialConditions: z
    .boolean()
    .refine((value) => value === true, "Debés aceptar las condiciones comerciales"),
  commitsToCommunicateConditions: z
    .boolean()
    .refine((value) => value === true, "Debés confirmar este compromiso"),
});

export type CommercialConditionRequestFormValues = z.infer<
  typeof commercialConditionRequestSchema
>;
