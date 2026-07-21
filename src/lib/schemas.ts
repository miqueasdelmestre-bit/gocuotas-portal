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

export const physicalMaterialRequestSchema = z.object({
  cuit: z
    .string()
    .min(1, "Ingresá tu CUIT")
    .refine(isValidCuit, "El CUIT ingresado no es válido"),
  contactName: z.string().min(2, "Ingresá un nombre de contacto"),
  phone: z.string().min(6, "Ingresá un teléfono de contacto"),
  email: z
    .string()
    .min(1, "Ingresá tu correo electrónico")
    .email("Ingresá un correo electrónico válido"),
  materialType: z.string().min(1, "Elegí un tipo de material"),
  notes: z.string().optional(),
  addressText: z
    .string()
    .min(8, "Ingresá la dirección completa (calle, altura y localidad)"),
  addressDetail: z.string().optional(),
});

export type PhysicalMaterialRequestFormValues = z.infer<typeof physicalMaterialRequestSchema>;
