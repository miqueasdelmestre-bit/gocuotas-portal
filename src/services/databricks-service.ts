/**
 * Consulta interna, server-only, contra el warehouse de Databricks
 * (prd.gold_dw) para confirmar si un CUIT corresponde a un comercio
 * activo registrado en GOcuotas.
 *
 * IMPORTANTE: el resultado de esta función NUNCA debe devolverse en la
 * respuesta de una API pública ni mostrarse en el formulario — solo se usa
 * para enriquecer el registro interno (fila del Google Sheet). No expone
 * ningún dato si no coincide, y no da pistas de por qué no coincidió.
 */

const DATABRICKS_HOST = process.env.DATABRICKS_HOST;
const DATABRICKS_TOKEN = process.env.DATABRICKS_TOKEN;
const DATABRICKS_WAREHOUSE_ID = process.env.DATABRICKS_WAREHOUSE_ID;

export interface CuitLookupResult {
  isRegisteredInGocuotas: boolean;
  businessName?: string;
  maxInstallments?: number;
}

const NOT_VERIFIED_RESULT: CuitLookupResult = { isRegisteredInGocuotas: false };

export async function lookupCuitInGocuotas(cuit: string): Promise<CuitLookupResult> {
  const digitsOnlyCuit = cuit.replace(/\D/g, "");

  if (!DATABRICKS_HOST || !DATABRICKS_TOKEN || !DATABRICKS_WAREHOUSE_ID) {
    return NOT_VERIFIED_RESULT;
  }

  // Solo dígitos, validado antes de interpolar en el SQL — evita cualquier
  // riesgo de inyección sin depender de la sintaxis exacta de parámetros
  // de la API de Databricks.
  if (!/^\d{1,11}$/.test(digitsOnlyCuit)) {
    return NOT_VERIFIED_RESULT;
  }

  try {
    const response = await fetch(`https://${DATABRICKS_HOST}/api/2.0/sql/statements/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${DATABRICKS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        warehouse_id: DATABRICKS_WAREHOUSE_ID,
        statement: `SELECT user_commerce_business_name, user_commerce_max_number_of_installments FROM prd.gold_dw.dim_users_commerce WHERE user_commerce_cuit = ${digitsOnlyCuit} AND discarded_at IS NULL LIMIT 1`,
        wait_timeout: "10s",
      }),
      signal: AbortSignal.timeout(12000),
    });

    if (!response.ok) return NOT_VERIFIED_RESULT;

    const data = await response.json();
    const row = data?.result?.data_array?.[0];

    if (!row) return NOT_VERIFIED_RESULT;

    const maxInstallments = row[1] != null ? Number(row[1]) : undefined;

    return {
      isRegisteredInGocuotas: true,
      businessName: row[0],
      maxInstallments: Number.isFinite(maxInstallments) ? maxInstallments : undefined,
    };
  } catch {
    // Falla silenciosa: si Databricks no responde, la solicitud igual se
    // guarda (sin verificación), nunca se bloquea el pedido del comercio.
    return NOT_VERIFIED_RESULT;
  }
}
