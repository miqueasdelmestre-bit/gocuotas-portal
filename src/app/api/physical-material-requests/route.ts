import { NextResponse } from "next/server";
import { z } from "zod";

import { appendPhysicalMaterialRows, lookupProvinciaLocalidadCp } from "@/services/google-sheets-service";
import { lookupCuitInGocuotas } from "@/services/databricks-service";

// El warehouse de Databricks puede tardar en "despertar" (auto-suspendido)
// y la consulta de verificación de CUIT espera hasta 50s por eso — el
// límite por defecto de la función (10s) no alcanzaría.
export const maxDuration = 60;

const requestBodySchema = z.object({
  brandName: z.string().min(1),
  cuit: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  branchCount: z.number().int().min(1).max(10),
  floorOrUnit: z.string().optional(),
  address: z.object({
    formattedAddress: z.string().min(1),
    street: z.string().optional(),
    streetNumber: z.string().optional(),
    postalCode: z.string().optional(),
  }),
});

// Valores fijos acordados con el negocio — el comercio no puede saberlos,
// es material que arma y despacha GOcuotas.
const FIXED_WEIGHT_GRAMS = 90;
const FIXED_DECLARED_VALUE = 6000;

/** CUIT = 2 dígitos de tipo + 8 dígitos de DNI + 1 dígito verificador. */
function deriveDniFromCuit(cuit: string): string {
  const digitsOnly = cuit.replace(/\D/g, "");
  return digitsOnly.slice(2, 10);
}

export async function POST(request: Request) {
  const parsed = requestBodySchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "invalid_payload" }, { status: 400 });
  }

  const { brandName, cuit, email, phone, branchCount, floorOrUnit, address } = parsed.data;

  // Verificación interna contra GOcuotas — el resultado se guarda solo en el
  // Sheet, nunca viaja de vuelta en esta respuesta ni se muestra al comercio.
  // Corren en paralelo porque son independientes entre sí.
  const [verification, provinciaLocalidadCp] = await Promise.all([
    lookupCuitInGocuotas(cuit),
    lookupProvinciaLocalidadCp(address.postalCode),
  ]);

  const numeroInterno = verification.maxInstallments
    ? `${verification.maxInstallments} cuotas`
    : "";
  // Nunca "0": vacío o el valor ingresado.
  const departamento = floorOrUnit && floorOrUnit !== "0" ? floorOrUnit : "";

  const row = [
    FIXED_WEIGHT_GRAMS,
    FIXED_DECLARED_VALUE,
    numeroInterno,
    "", // Referencia
    brandName, // Nombre
    brandName, // Apellido
    deriveDniFromCuit(cuit),
    email,
    phone,
    address.street ?? address.formattedAddress,
    address.streetNumber ?? "",
    "", // Piso
    departamento,
    "", // Observaciones
    provinciaLocalidadCp,
  ];

  // Una fila por sucursal: el courier necesita un envío separado por cada una.
  const rows = Array.from({ length: branchCount }, () => row);

  try {
    await appendPhysicalMaterialRows(rows);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("No se pudo guardar la solicitud de material físico en Google Sheets", error);
    return NextResponse.json({ success: false, error: "sheets_error" }, { status: 500 });
  }
}
