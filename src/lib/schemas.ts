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
  brandName: z.string().min(2, "Ingresá el nombre de tu marca"),
  cuit: z
    .string()
    .min(1, "Ingresá el CUIT de tu razón social")
    .regex(/^\d+$/, "Ingresá el CUIT solo con números, sin guiones ni espacios")
    .refine(isValidCuit, "El CUIT ingresado no es válido"),
  email: z
    .string()
    .min(1, "Ingresá tu correo electrónico")
    .email("Ingresá un correo electrónico válido"),
  phone: z
    .string()
    .min(1, "Ingresá tu teléfono")
    .regex(/^\d+$/, "Ingresá el teléfono solo con números, sin 0 ni 15"),
  addressText: z
    .string()
    .min(8, "Ingresá la dirección completa (calle y altura) y elegí la opción correcta"),
  branchCount: z.coerce
    .number({ invalid_type_error: "Ingresá la cantidad de sucursales" })
    .int("Ingresá un número entero")
    .min(1, "Ingresá al menos 1 sucursal"),
});

export type PhysicalMaterialRequestFormValues = z.infer<typeof physicalMaterialRequestSchema>;
