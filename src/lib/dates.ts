/** Fecha en horario argentino, como dd/mm/aaaa. */
export function formatDateAr(date: Date): string {
  return new Intl.DateTimeFormat("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}
