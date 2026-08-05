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
        // Un mismo CUIT puede tener más de un comercio registrado (duplicados).
        // Ante esa duda, se prioriza el que tenga operaciones entregadas más
        // recientes — es el que realmente está operando hoy, y de ahí sale la
        // cantidad máxima de cuotas que ofrece. La subquery correlacionada
        // tiene que ir en el SELECT (con alias) y no directo en el ORDER BY:
        // Spark SQL no soporta correlated scalar subqueries ahí.
        statement: `SELECT c.user_commerce_max_number_of_installments, (SELECT MAX(o.delivered_at) FROM prd.gold_dw.fact_go_cuotas_orders o WHERE o.user_commerce_id = c.user_commerce_id AND o.delivered_at IS NOT NULL AND o.discarded_at IS NULL) AS last_order FROM prd.gold_dw.dim_users_commerce c WHERE c.user_commerce_cuit = ${digitsOnlyCuit} AND c.discarded_at IS NULL ORDER BY last_order DESC NULLS LAST LIMIT 1`,
        // 50s es el máximo que admite la API de Databricks para esperar en la
        // misma request — hace falta, porque el warehouse suele estar
        // "dormido" (auto-suspendido) y tarda en despertar si no hubo
        // consultas recientes.
        wait_timeout: "50s",
      }),
      signal: AbortSignal.timeout(55000),
    });

    if (!response.ok) return NOT_VERIFIED_RESULT;

    const data = await response.json();

    // Si el warehouse todavía estaba despertando, la consulta puede seguir
    // "PENDING" incluso después de esperar el máximo — no hay resultado,
    // no es un error: simplemente no llegamos a verificar esta vez.
    if (data?.status?.state !== "SUCCEEDED") {
      if (data?.status?.state === "FAILED") {
        console.error("Error en la consulta de verificación de CUIT a Databricks", data.status.error);
      }
      return NOT_VERIFIED_RESULT;
    }

    const row = data?.result?.data_array?.[0];

    if (!row) return NOT_VERIFIED_RESULT;

    const maxInstallments = row[0] != null ? Number(row[0]) : undefined;

    return {
      isRegisteredInGocuotas: true,
      maxInstallments: Number.isFinite(maxInstallments) ? maxInstallments : undefined,
    };
  } catch {
    // Falla silenciosa: si Databricks no responde, la solicitud igual se
    // guarda (sin verificación), nunca se bloquea el pedido del comercio.
    return NOT_VERIFIED_RESULT;
  }
}
