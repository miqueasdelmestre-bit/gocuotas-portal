import type {
  CommercialConditionRequestInput,
  CommercialConditionRequestResult,
} from "@/types/request";

/**
 * Punto único de integración para las solicitudes de cambio de condiciones
 * comerciales. Hoy simula el envío; está pensado para reemplazarse por
 * llamadas reales (Gmail API para notificar, Google Sheets API para
 * registrar la solicitud) sin tocar los componentes que lo consumen.
 */
export async function submitCommercialConditionRequest(
  input: CommercialConditionRequestInput,
): Promise<CommercialConditionRequestResult> {
  await new Promise((resolve) => setTimeout(resolve, 900));

  return {
    success: true,
    submittedAt: new Date().toISOString(),
  };
}
