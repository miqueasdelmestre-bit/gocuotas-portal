import type { Metadata } from "next";

import { PhysicalMaterialRequestView } from "@/components/features/material-fisico/physical-material-request-view";
import { isValidCuit } from "@/lib/validators";

export const metadata: Metadata = {
  title: "Material publicitario físico · GOcuotas",
};

interface MaterialPublicitarioFisicoPageProps {
  searchParams: Promise<{ utm_source?: string; cuit?: string; marca?: string }>;
}

export default async function MaterialPublicitarioFisicoPage({
  searchParams,
}: MaterialPublicitarioFisicoPageProps) {
  const { utm_source: utmSource, cuit, marca } = await searchParams;

  // Links armados por GOcuotas (ej. desde el relevamiento de cartelería) traen el CUIT del
  // comercio: se precarga y se bloquea para que quien completa no pueda pedir con otro CUIT.
  // Solo se usa lo que viene en el propio link — no se consulta nada interno para mostrarlo.
  const lockedCuit = cuit && isValidCuit(cuit) ? cuit : undefined;
  const initialBrandName = lockedCuit && marca ? marca.slice(0, 80) : undefined;

  return (
    <PhysicalMaterialRequestView
      utmSource={utmSource}
      lockedCuit={lockedCuit}
      initialBrandName={initialBrandName}
    />
  );
}
