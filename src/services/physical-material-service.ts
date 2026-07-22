import type {
  PhysicalMaterialRequestInput,
  PhysicalMaterialRequestResult,
} from "@/types/physical-material-request";

/**
 * Envía el pedido de material POP a la API propia, que lo guarda como fila
 * nueva en el Google Sheet configurado (ver src/services/google-sheets-service.ts).
 */
export async function submitPhysicalMaterialRequest(
  input: PhysicalMaterialRequestInput,
): Promise<PhysicalMaterialRequestResult> {
  const response = await fetch("/api/physical-material-requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  return {
    success: response.ok,
    submittedAt: new Date().toISOString(),
  };
}
