import { NextResponse } from "next/server";
import { z } from "zod";

import { appendSheetRow } from "@/services/google-sheets-service";
import { lookupCuitInGocuotas } from "@/services/databricks-service";

const requestBodySchema = z.object({
  brandName: z.string().min(1),
  cuit: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  branchCount: z.number(),
  address: z.object({ formattedAddress: z.string().min(1) }),
});

export async function POST(request: Request) {
  const parsed = requestBodySchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "invalid_payload" }, { status: 400 });
  }

  const { brandName, cuit, email, phone, branchCount, address } = parsed.data;

  // Verificación interna contra GOcuotas — el resultado se guarda solo en el
  // Sheet, nunca viaja de vuelta en esta respuesta ni se muestra al comercio.
  const verification = await lookupCuitInGocuotas(cuit);

  try {
    await appendSheetRow([
      new Date().toISOString(),
      brandName,
      cuit,
      email,
      phone,
      address.formattedAddress,
      branchCount,
      verification.isRegisteredInGocuotas ? "Sí" : "No",
      verification.businessName ?? "",
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("No se pudo guardar la solicitud de material físico en Google Sheets", error);
    return NextResponse.json({ success: false, error: "sheets_error" }, { status: 500 });
  }
}
