import type { Metadata } from "next";

import { CommercialConditionsView } from "@/components/features/condiciones-comerciales/commercial-conditions-view";

export const metadata: Metadata = {
  title: "Condiciones Comerciales · GOcuotas",
};

export default function CondicionesComercialesPage() {
  return <CommercialConditionsView />;
}
