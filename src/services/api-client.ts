/**
 * Cliente HTTP genérico, preparado para cuando exista un backend propio
 * (auth, base de datos, integraciones con Gmail/Sheets/Drive). Hoy no lo
 * consume ningún servicio activo.
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export async function apiRequest<TResponse>(
  path: string,
  options?: RequestInit,
): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Request to ${path} failed with status ${response.status}`);
  }

  return response.json() as Promise<TResponse>;
}
