import type {
  PhysicalMaterialRequestInput,
  PhysicalMaterialRequestResult,
} from "@/types/physical-material-request";

/**
 * Punto único de integración para los pedidos de material POP. Hoy simula
 * el envío; está pensado para reemplazarse por la creación del pedido en
 * el sistema interno (y la notificación al equipo de logística) sin tocar
 * los componentes que lo consumen.
 */
export async function submitPhysicalMaterialRequest(
  input: PhysicalMaterialRequestInput,
): Promise<PhysicalMaterialRequestResult> {
  await new Promise((resolve) => setTimeout(resolve, 900));

  return {
    success: true,
    submittedAt: new Date().toISOString(),
  };
}
